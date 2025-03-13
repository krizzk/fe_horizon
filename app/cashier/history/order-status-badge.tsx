import type React from "react"
interface OrderStatusBadgeProps {
  status: string
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "NEW":
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">NEW</span>
    case "PAID":
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">PAID</span>
    case "DONE":
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">DONE</span>
    default:
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>
  }
}

export default OrderStatusBadge

