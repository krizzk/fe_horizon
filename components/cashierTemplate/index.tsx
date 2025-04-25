"use client"
import { type ReactNode, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import MenuItem from "./menuItem"
import { removeCookie, getCookie } from "@/lib/client-cookie"
import { useRouter } from "next/navigation"
import type { IUser } from "@/app/types"
import { BASE_IMAGE_PROFILE } from "@/global"
import { Menu, LogOut } from "lucide-react"
import { cn } from "@/lib/utilis"

type MenuType = {
  id: string
  icon: ReactNode
  path: string
  label: string
}

type CashierProp = {
  children: ReactNode
  id: string
  user?: IUser | null
  title: string
  menuList: MenuType[]
}

const CashierTemplate = ({ children, id, title, menuList, user }: CashierProp) => {
  const [userName, setUserName] = useState<string>("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const [profileUpdateTime, setProfileUpdateTime] = useState<number>(Date.now())
  const [forceUpdate, setForceUpdate] = useState(0)

  useEffect(() => {
    // Force a refresh when component mounts
    setForceUpdate((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const name = getCookie("name")
    if (name) {
      setUserName(name)
    }

    // Check if sidebar state is saved in localStorage
    const savedSidebarState = localStorage.getItem("sidebarOpen")
    if (savedSidebarState !== null) {
      setSidebarOpen(savedSidebarState === "true")
    }

    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
      }
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen.toString())
  }, [sidebarOpen])

  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfileUpdateTime(Date.now())
    }

    window.addEventListener("profile-updated", handleProfileUpdate)
    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate)
    }
  }, [])

  const handleLogout = () => {
    removeCookie("token")
    removeCookie("id")
    removeCookie("name")
    removeCookie("role")
    removeCookie("cart")
    router.replace(`/login`)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar - Fixed position, doesn't scroll with content */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full bg-white border-r transition-all duration-300 ease-in-out overflow-y-auto",
          sidebarOpen ? "w-64" : "w-0 -translate-x-full",
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center">
          <Link href="/cashier/dashboard" className="flex items-center space-x-2 text-black">
            <Image src="/image/restaurant.jpg" alt="Restaurant Logo" width={40} height={40} className="rounded-full" />
            <span className="font-bold text-xl text-black">Restaurant</span>
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200">
              {user?.profile_picture ? (
                <Image
                  src={`${BASE_IMAGE_PROFILE}/${user.profile_picture}?v=${forceUpdate}-${new Date().getTime()}`}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized={true}
                  key={`profile-${user.profile_picture}-${forceUpdate}-${new Date().getTime()}`}
                />
              ) : (
                <Image
                  src="/image/profile.jpg"
                  alt="Default Profile"
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-black">{userName || "User"}</div>
              <div className="text-sm text-gray-500">Cashier Staff</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1">
          {menuList.map((menu, index) => (
            <MenuItem
              key={`menu-${index}`}
              icon={menu.icon}
              path={menu.path}
              label={menu.label}
              active={menu.id === id}
            />
          ))}
        </nav>
      </aside>

      {/* Main Content - Takes full width when sidebar is closed */}
      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-64" : "ml-0",
        )}
      >
        {/* Fixed Header - Always visible */}
        <header className="sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-black">{title}</h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-white">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

export default CashierTemplate

