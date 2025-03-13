export interface IMenu {
  id: number
  uuid: string
  name: string
  price: number
  picture: string
  description: string
  category: string
  createdAt: string
  updatedAt: string
}

export interface ICart {
  menuId: number
  name: string
  price: number
  quantity: number
  note: string
  picture: string
}

export interface IOrderList {
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
    picture?: string
  }
}

export interface IOrder {
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
  orderList: IOrderList[]
}

export interface ITableStatus {
  table_number: string
  status: string
}

export interface IOrderPayload {
  customer: string
  table_number: string
  payment_method: "CASH" | "QRIS"
  status: "NEW" | "PAID" | "DONE"
  orderlists: {
    menuId: number
    quantity: number
    note: string
  }[]
}

// Dashboard interfaces
export interface FavoriteMenuResponse {
  menuId: number
  count: number
}

export interface FavoriteMenu {
  id: number
  name: string
  price: number
  picture: string
  category: string
  description?: string
  orderCount: number
}
