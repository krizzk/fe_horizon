"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { get } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookie"
import { BASE_API_URL } from "@/global"
import { AlertInfo } from "@/components/alert"
import { FiEdit3 } from "react-icons/fi"
import OrderStatusBadge from "./order-status-badge"
import EditOrderModal from "./edit-order-modal"

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const HistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const TOKEN = getCookie("token") || ""
      const url = `${BASE_API_URL}/order/allOrders`
      const { data } = await get(url, TOKEN)

      if (data?.status) {
        setOrders(data.data || [])
      } else {
        console.error("Failed to fetch orders:", data?.message)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (order: Order) => {
    setSelectedOrder(order)
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    fetchOrders() // Refresh the orders list
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      <div className="m-2 bg-white rounded-lg p-5 border-t-4 border-t-primary shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900">Order History</h4>
            <p className="text-sm text-gray-600 mb-4">View and manage all orders regardless of their status</p>
          </div>
          <Link
            href="/cashier/pesan_makanan"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md transition-all"
          >
            Add Order
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent"></div>
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <AlertInfo title="Information">No orders available</AlertInfo>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.orderList && order.orderList.length > 0
                          ? order.orderList.map((item) => item.menu.name).join(", ")
                          : "No items"}
                      </div>
                      <div className="text-xs text-gray-500">
                        Customer: {order.customer} | Table: {order.table_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.orderList ? order.orderList.reduce((sum, item) => sum + item.quantity, 0) : 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEditClick(order)}
                        className="inline-flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                        title="Edit Order"
                      >
                        <FiEdit3 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <EditOrderModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          order={selectedOrder}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}

export default HistoryPage

