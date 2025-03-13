import type React from "react"
import CashierTemplate from "@/components/cashierTemplate"
import MenuList from "../menuList"

export const metadata = {
  title: "Order History | Ordering System",
  description: "View and manage all food orders",
}

type PropsLayout = {
  children: React.ReactNode
}

const HistoryLayout = ({ children }: PropsLayout) => {
  return (
    <CashierTemplate title="Order History" id="History" menuList={MenuList}>
      {children}
    </CashierTemplate>
  )
}

export default HistoryLayout

