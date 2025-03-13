"use client"
import { useState } from "react"
import type React from "react"

import { BASE_API_URL } from "@/global"
import { getCookie } from "@/lib/client-cookie"
import { put } from "@/lib/api-bridge"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import OrderStatusBadge from "./order-status-badge"

interface OrderList {
  id: number
  uuid: string
  orderId: number
  menuId: number
  quantity: number
  note: string
  menu: {
    id: number
    name: string
    price: number
  }
}

interface Order {
  id: number
  uuid: string
  customer: string
  table_number: string
  total_price: number
  payment_method: string
  status: string
  userId: number
  createdAt: string
  updatedAt: string
  orderList: OrderList[]
}

interface EditOrderModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order
  onSuccess: () => void
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ isOpen, onClose, order, onSuccess }) => {
  const [status, setStatus] = useState<string>(order.status || "NEW")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const TOKEN = getCookie("token") || ""
      const url = `${BASE_API_URL}/order/${order.id}`

      const payload = {
        status,
      }
    
      const { data } = await put(url, JSON.stringify(payload), TOKEN)

      if (data?.status) {
        toast.success("Order status updated successfully")
        setTimeout(() => {
          onSuccess()
        }, 1500)
      } else {
        toast.error(data?.message || "Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("An error occurred while updating the order")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b">
          <div className="w-full flex items-center">
            <div className="flex flex-col">
              <strong className="font-bold text-xl">Edit Order</strong>
              <small className="text-slate-400 text-sm">
                Order #{order.id} - {order.customer}
              </small>
            </div>
            <div className="ml-auto">
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600"
                onClick={onClose}
                disabled={isLoading}
              >
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

        <div className="p-5">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Customer</p>
              <p className="text-base">{order.customer}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Table Number</p>
              <p className="text-base">{order.table_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payment Method</p>
              <p className="text-base">{order.payment_method}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Status</p>
              <div className="mt-1">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Order Items</h3>
            <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
              {order.orderList && order.orderList.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {order.orderList.map((item) => (
                    <li key={item.id} className="py-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.menu.name}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} x {formatPrice(item.menu.price)}
                            {item.note && <span className="italic"> - Note: {item.note}</span>}
                          </p>
                        </div>
                        <p className="font-medium">{formatPrice(item.quantity * item.menu.price)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No items in this order</p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="NEW">NEW</option>
                <option value="PAID">PAID</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default EditOrderModal

