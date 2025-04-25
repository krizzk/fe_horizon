"use client"
import { useEffect, useState } from "react"
import { FaClipboardList, FaStar } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
import Profile from "../../../public/image/restaurant.jpg"
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
import { getCookie } from "@/lib/client-cookie"
import { get } from "@/lib/api-bridge"
import { FaBellConcierge, FaClockRotateLeft, FaBowlRice } from "react-icons/fa6"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import type { FavoriteMenu, IOrder } from "@/app/types"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend)

const getMenuCount = async () => {
  try {
    const TOKEN = getCookie("token") ?? ""
    const url = `${BASE_API_URL}/menu`
    const { data } = await get(url, TOKEN)
    if (data?.status) {
      return data.data.length
    }
    return 0
  } catch (error) {
    console.error("Error fetching menu data:", error)
    return 0
  }
}

const getOrderCount = async () => {
  try {
    const TOKEN = getCookie("token") ?? ""
    const url = `${BASE_API_URL}/order/allOrders`
    const { data } = await get(url, TOKEN)
    if (data?.status) {
      return data.data.length
    }
    return 0
  } catch (error) {
    console.error("Error fetching order data:", error)
    return 0
  }
}

const getNewOrderCount = async () => {
  try {
    const TOKEN = getCookie("token") ?? ""
    const url = `${BASE_API_URL}/order/allOrders`
    const { data } = await get(url, TOKEN)
    if (data?.status && Array.isArray(data.data)) {
      // Filter orders with status "NEW"
      const newOrders = data.data.filter((order: IOrder) => order.status === "NEW")
      return newOrders.length
    }
    return 0
  } catch (error) {
    console.error("Error fetching new order data:", error)
    return 0
  }
}

const getFavoriteMenus = async () => {
  try {
    const TOKEN = getCookie("token") ?? ""
    const url = `${BASE_API_URL}/report/favorite`
    const { data } = await get(url, TOKEN)
    console.log("Favorite menu API response:", data)

    if (data?.status && Array.isArray(data.data)) {
      // Log the first item to see its structure
      if (data.data.length > 0) {
        console.log("First favorite menu item structure:", data.data[0])
      }

      // Make sure each item has the correct properties
      const mappedData = data.data.map((item: any) => ({
        ...item,
        // If count is missing, check for alternative properties or default to 0
        orderCount: item.count || item.orderCount || 0,
      }))

      // Sort by orderCount in descending order
      return mappedData.sort((a: FavoriteMenu, b: FavoriteMenu) => (b.orderCount || 0) - (a.orderCount || 0))
    }
    return []
  } catch (error) {
    console.error("Error fetching favorite menu data:", error)
    return []
  }
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const getCategoryBadge = (category: string) => {
  switch (category) {
    case "FOOD":
      return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Food</span>
    case "SNACK":
      return <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Snack</span>
    case "DRINK":
      return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Drink</span>
    default:
      return (
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{category}</span>
      )
  }
}

const Dashboard = () => {
  const [menuCount, setMenuCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [newOrderCount, setNewOrderCount] = useState(0)
  const [favoriteMenus, setFavoriteMenus] = useState<FavoriteMenu[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const menuCountData = await getMenuCount()
        const orderCountData = await getOrderCount()
        const newOrderCountData = await getNewOrderCount()
        const favoriteMenusData = await getFavoriteMenus()

        console.log("Fetched favorite menus:", favoriteMenusData)

        // Log the properties of each menu item to debug
        if (favoriteMenusData.length > 0) {
          console.log("Menu properties available:", Object.keys(favoriteMenusData[0]))
          console.log(
            "Order count values:",
            favoriteMenusData.map((menu: FavoriteMenu) => menu.orderCount || 0),
          )
        }

        setMenuCount(menuCountData)
        setOrderCount(orderCountData)
        setNewOrderCount(newOrderCountData)
        // Sort favorite menus by orderCount in descending order
        const sortedFavoriteMenus = favoriteMenusData.sort((a: FavoriteMenu, b: FavoriteMenu) => (b.orderCount || 0) - (a.orderCount || 0))
        setFavoriteMenus(sortedFavoriteMenus)
      } catch (error) {
        console.error("Error in fetchData:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Prepare chart data - with safety checks
  const chartData = {
    labels: favoriteMenus.length > 0 ? favoriteMenus.slice(0, 5).map((menu) => menu.name || "Unknown") : [],
    datasets: [
      {
        label: "Order Count",
        data: favoriteMenus.length > 0 ? favoriteMenus.slice(0, 5).map((menu) => menu.orderCount || 0) : [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        display: true,
        align: "center" as const,
        labels: {
          boxWidth: 15,
          padding: 10,
          usePointStyle: true,
          pointStyle: "circle" as const,
        },
      },
      title: {
        display: true,
        text: "Most Ordered Menu Items",
        font: {
          size: 16,
        },
        padding: {
          bottom: 10,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    layout: {
      padding: {
        bottom: 10,
      },
    },
  }

  // Debug chart data
  console.log("Chart data:", chartData)
  console.log("Chart has data points:", chartData.datasets[0].data.length > 0)

  return (
    <div className="flex-grow min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">FOOODDEEERRRR</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Overview Section */}
            <div className="rounded-lg bg-white p-6 shadow-lg mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                <Image
                  src={Profile || "/placeholder.svg"}
                  width={50}
                  height={50}
                  alt="Profile"
                  className="rounded-full"
                />
              </div>
              <div className="flex justify-around">
                <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                  <div className="p-3 mr-4 bg-blue-500 text-white rounded-full">
                    <FaClipboardList size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Menus</p>
                    <p className="text-lg font-semibold text-gray-700">{menuCount}</p>
                  </div>
                </div>
                {/* <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                  <div className="p-3 mr-4 bg-green-500 text-white rounded-full">
                    <FaStar size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Menu favourite</p>
                    <p className="text-lg font-semibold text-gray-700">{favoriteMenus.length}</p>
                  </div>
                </div> */}
                <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                  <div className="p-3 mr-4 bg-yellow-500 text-white rounded-full">
                    <FaBellConcierge size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pesan makanan</p>
                    <p className="text-lg font-semibold text-gray-700">{newOrderCount}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                  <div className="p-3 mr-4 bg-red-500 text-white rounded-full">
                    <FaClockRotateLeft size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">History</p>
                    <p className="text-lg font-semibold text-gray-700">{orderCount}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Link
                    href="/cashier/menu"
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                  >
                    <FaClipboardList className="mr-2" />
                    Menus
                  </Link>
                  <Link
                    href="/cashier/menu_favorite"
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                  >
                    {/* <FaStar className="mr-2" />
                    menu favourite
                  </Link>
                  <Link
                    href="/cashier/pesan_makanan"
                    className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600"
                  > */}
                    <FaBellConcierge className="mr-2" />
                    pesan makanan
                  </Link>
                  <Link
                    href="/cashier/history"
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
                  >
                    <FaClockRotateLeft className="mr-2" />
                    history pemesanan
                  </Link>
                </div>
              </div>
            </div>

            {/* Favorite Menu Section */}
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu Favorit</h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : favoriteMenus.length === 0 ? (
                <div className="text-center py-10 text-gray-500">Belum ada data menu favorit</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pie Chart */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="h-64 flex items-center justify-center">
                      {favoriteMenus.length > 0 && chartData.datasets[0].data.length > 0 ? (
                        <Pie data={chartData} options={chartOptions} />
                      ) : (
                        <div className="text-center text-gray-500">
                          <p>No data available for chart</p>
                          <p className="text-sm mt-2">Check console for debugging information</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top 3 Favorite Menu List */}
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-black">Top 3 Menu Favorit</h3>
                    <div className="space-y-4">
                      {favoriteMenus.slice(0, 3).map((menu, index) => (
                        <div
                          key={`favorite-menu-${menu.id || index}-${index}`}
                          className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden mr-4 flex-shrink-0">
                            {menu.picture ? (
                              <Image
                                fill
                                src={`${BASE_IMAGE_MENU}/${menu.picture}`}
                                alt={menu.name || "Menu item"}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaBowlRice size={24} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{menu.name || "Unnamed menu"}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-sm text-gray-500">{formatPrice(menu.price || 0)}</p>
                                  {menu.category && getCategoryBadge(menu.category)}
                                </div>
                              </div>
                              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                <span
                                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                    index === 0
                                      ? "bg-yellow-400 text-yellow-800"
                                      : index === 1
                                        ? "bg-gray-300 text-gray-800"
                                        : "bg-amber-700 text-amber-200"
                                  }`}
                                >
                                  #{index + 1}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">di pesan sebanyak: {menu.orderCount || 0}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard

