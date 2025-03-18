"use client"
import type { ICart, IOrderPayload, ITableStatus } from "@/app/types"
import type React from "react"

import { BASE_API_URL } from "@/global"
import { post, get } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookie"
import { useRouter } from "next/navigation"
import { type FormEvent, useRef, useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import { ButtonPrimary, ButtonSuccess, ButtonDanger } from "@/components/button"
import { InputGroupComponent } from "@/components/inputComponents"
import Modal from "@/components/modal"
import Select from "@/components/select"
import Cookies from "js-cookie"

interface AddOrderProps {
  cart: ICart[]
  total: number
  onOrderSuccess: () => void
  formatPrice: (price: number) => string
}

const AddOrder: React.FC<AddOrderProps> = ({ cart, total, onOrderSuccess, formatPrice }) => {
  const [isShow, setIsShow] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [tableStatuses, setTableStatuses] = useState<ITableStatus[]>([])
  const [tableError, setTableError] = useState<string>("")

  const [orderData, setOrderData] = useState<IOrderPayload>({
    customer: "",
    table_number: "",
    payment_method: "CASH",
    status: "NEW",
    orderlists: [],
  })

  const router = useRouter()
  const TOKEN = getCookie("token") || ""
  const formRef = useRef<HTMLFormElement>(null)

  // Fetch active tables (tables with NEW or PAID status)
  const fetchActiveTables = async () => {
    try {
      const url = `${BASE_API_URL}/order/allOrders`
      const { data } = await get(url, TOKEN)
      if (data?.status && Array.isArray(data.data)) {
        setTableStatuses(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch active tables:", error)
    }
  }

  useEffect(() => {
    if (isShow) {
      fetchActiveTables()
    }
  }, [isShow])

  const openModal = () => {
    // Prepare order data from cart with empty strings for notes
    const orderlists = cart.map((item) => ({
      menuId: item.menuId,
      quantity: item.quantity,
      note: item.note || "", // Always use empty string instead of null
    }))

    setOrderData({
      customer: "",
      table_number: "",
      payment_method: "CASH",
      status: "NEW",
      orderlists,
    })

    setTableError("")
    setIsShow(true)
    if (formRef.current) formRef.current.reset()
  }

  // Update the onClose handler to ensure cart state is preserved
  const handleCancel = () => {
    setIsShow(false)
  }

  const validateTableNumber = (tableNumber: string): boolean => {
    // Check if table is already in use with NEW or PAID status
    const activeTable = tableStatuses.find(
      (t) => t.table_number === tableNumber && (t.status === "NEW" || t.status === "PAID"),
    )
    if (activeTable) {
      setTableError(`Table ${tableNumber} is already in use with status: ${activeTable.status}`)
      return false
    }
    setTableError("")
    return true
  }

  const handleTableNumberChange = (value: string) => {
    setOrderData({ ...orderData, table_number: value })
    validateTableNumber(value)
  }

  const handleStatusChange = (value: string) => {
    const newStatus = value as "NEW" | "PAID"
    setOrderData({ ...orderData, status: newStatus })
  }

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault()

      // Validate table number
      if (!validateTableNumber(orderData.table_number)) {
        return
      }

      setIsLoading(true)

      // Validate if cart is empty
      if (orderData.orderlists.length === 0) {
        toast("Cannot create order with empty cart", {
          hideProgressBar: true,
          containerId: `toastOrder`,
          type: `warning`,
        })
        setIsLoading(false)
        return
      }

      // Ensure all notes are strings (not null or undefined)
      const sanitizedOrderlists = orderData.orderlists.map((item) => ({
        menuId: item.menuId,
        quantity: item.quantity,
        note: item.note || "", // Always use empty string
      }))

      // Keep table_number as string as required by the backend
      const payload = {
        ...orderData,
        table_number: orderData.table_number, // Keep as string
        orderlists: sanitizedOrderlists,
      }

      const url = `${BASE_API_URL}/order`
      const { data } = await post(url, JSON.stringify(payload), TOKEN)

      if (data?.status) {
        setIsShow(false)
        toast(data?.message || "Order created successfully", {
          hideProgressBar: true,
          containerId: `toastOrder`,
          type: `success`,
        })
        onOrderSuccess()
        Cookies.remove("cart")
      } else {
        toast(data?.message || "Failed to create order", {
          hideProgressBar: true,
          containerId: `toastOrder`,
          type: `warning`,
        })
      }
    } catch (error) {
      console.error(error)
      toast(`Something went wrong`, {
        hideProgressBar: true,
        containerId: `toastOrder`,
        type: `error`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <ButtonSuccess
        type="button"
        onClick={openModal}
        disabled={cart.length === 0}
        className="w-full mt-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Checkout
      </ButtonSuccess>

      <Modal
        isShow={isShow}
        onClose={(state) => {
          // Only close if explicitly set to false
          if (state === false) {
            setIsShow(false)
          }
        }}
      >
        <form ref={formRef} onSubmit={handleSubmit}>
          {/* Modal header */}
          <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
            <div className="w-full flex items-center ">
              <div className="flex flex-col">
                <strong className="font-bold text-2xl text-black">Complete Your Order</strong>
                <small className="text-slate-400 text-sm">Please fill in the order details</small>
              </div>
              <div className="ml-auto">
                {/* Replace the button onClick handler */}
                <button type="button" className="text-slate-400" onClick={handleCancel} disabled={isLoading}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* End modal header */}

          {/* Modal body */}
          <div className="p-5">
            <InputGroupComponent
              className="text-black"
              id="customer"
              type="text"
              value={orderData.customer}
              onChange={(val) => setOrderData({ ...orderData, customer: val })}
              required={true}
              label="Customer Name"
            />

            <div className="mb-4">
              <InputGroupComponent
                className="text-black"
                id="table_number"
                type="text" // Changed to text to ensure it's a string
                value={orderData.table_number}
                onChange={handleTableNumberChange}
                required={true}
                label="Table Number"
              />
              {tableError && <p className="text-red-500 text-sm mt-1">{tableError}</p>}
            </div>

            <Select
              className="text-black"
              id="payment_method"
              value={orderData.payment_method}
              label="Payment Method"
              required={true}
              onChange={(val) => setOrderData({ ...orderData, payment_method: val as "CASH" | "QRIS" })}
            >
              <option value="CASH">Cash</option>
              <option value="QRIS">QRIS</option>
            </Select>

            <Select
              className="text-black"
              id="status"
              value={orderData.status}
              label="Order Status"
              required={true}
              onChange={handleStatusChange}
            >
              <option value="NEW">New</option>
              <option value="PAID">Paid</option>
              {/* Removed DONE option as requested */}
            </Select>

            {/* Order summary */}
            <div className="mt-4 border rounded-lg p-4 text-black">
              <h3 className="font-semibold text-lg mb-2 text-black">Order Summary</h3>
              <div className="max-h-40 overflow-y-auto mb-3">
                {cart.map((item) => (
                  <div key={item.menuId} className="flex justify-between items-center py-1 border-b">
                    <div>
                      <span className="font-medium text-black">{item.name}</span>
                      <span className="text-sm text-black block">
                        {item.quantity} x {formatPrice(item.price)}
                        {item.note && item.note.trim() !== "" && <span className="italic"> - Note: {item.note}</span>}
                      </span>
                    </div>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-lg text-black">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
          {/* End modal body */}

          {/* Modal footer */}
          <div className="w-full p-5 flex rounded-b-2xl shadow">
            <div className="flex ml-auto gap-2">
              {/* And update the cancel button in the footer */}
              <ButtonDanger type="button" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </ButtonDanger>
              <ButtonPrimary type="submit" disabled={isLoading || !!tableError}>
                {isLoading ? "Processing..." : "Confirm Order"}
              </ButtonPrimary>
            </div>
          </div>
          {/* End modal footer */}
        </form>
      </Modal>

      <ToastContainer containerId="toastOrder" position="top-right" />
    </div>
  )
}

export default AddOrder

