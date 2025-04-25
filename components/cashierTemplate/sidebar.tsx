"use client"
import { type ReactNode, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import MenuItem from "./menuItem"
import { removeCookie, getCookie } from "@/lib/client-cookie"
import { useRouter } from "next/navigation"
import type { IUser } from "@/app/types"
import { BASE_IMAGE_PROFILE } from "@/global"
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarClose,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings } from "lucide-react"

type MenuType = {
  id: string
  icon: ReactNode
  path: string
  label: string
}

type CashierProp = {
  children: ReactNode
  id: string
  user: IUser | null
  title: string
  menuList: MenuType[]
}

const SidebarComponent = ({ children, id, title, menuList, user }: CashierProp) => {
  const [userName, setUserName] = useState<string>("")
  const [forceUpdate, setForceUpdate] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const name = getCookie("name")
    if (name) {
      setUserName(name)
    }

    // Force a refresh when component mounts
    setForceUpdate((prev) => prev + 1)

    // Set up an interval to periodically refresh the profile image
    const intervalId = setInterval(() => {
      setForceUpdate((prev) => prev + 1)
    }, 30000) // Check every 30 seconds

    return () => clearInterval(intervalId)
  }, [])

  const handleLogout = () => {
    removeCookie("token")
    removeCookie("id")
    removeCookie("name")
    removeCookie("role")
    removeCookie("cart")
    router.replace(`/login`)
  }

  const logoSrc = "/image/restaurant.jpg"
  const defaultProfileSrc = "/image/profile.jpg"

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen bg-amber-50">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="flex items-center border-b border-amber-200 py-4">
            <div className="flex items-center space-x-2">
              <Image
                src={logoSrc || "/placeholder.svg"}
                alt="Restaurant Logo"
                width={40}
                height={40}
                className="rounded-full border-2 border-amber-400"
              />
              <h1 className="font-bold text-xl text-amber-800">Restaurant</h1>
            </div>
            <SidebarClose className="ml-auto" />
          </SidebarHeader>

          <SidebarContent>
            <div className="mb-6 p-2 bg-amber-200/50 rounded-lg flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-amber-400">
                {user?.profile_picture ? (
                  <Image
                    src={`${BASE_IMAGE_PROFILE}/${user.profile_picture}?v=${new Date().getTime()}`}
                    alt="Profile"
                    fill
                    className="object-cover"
                    unoptimized={true}
                    key={`sidebar-profile-${user.profile_picture}-${new Date().getTime()}`}
                  />
                ) : (
                  <Image
                    src={defaultProfileSrc || "/placeholder.svg"}
                    alt="Default Profile"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-medium text-amber-900 truncate">{userName || "User"}</div>
                <div className="text-xs text-amber-700 truncate">Cashier Staff</div>
              </div>
            </div>

            <div className="space-y-1">
              {menuList.map((menu, index) => (
                <MenuItem
                  key={`menu-${index}`}
                  icon={menu.icon}
                  path={menu.path}
                  label={menu.label}
                  active={menu.id === id}
                />
              ))}
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-amber-200 pt-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md p-2 text-sm text-red-600 hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all">
          <header className="bg-amber-500 border-b border-amber-600 text-white p-3 flex items-center sticky top-0 z-10">
            <SidebarTrigger />
            <h1 className="text-xl font-bold ml-3">{title}</h1>

            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-md hover:bg-amber-600 transition-colors">
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white">
                    {user?.profile_picture ? (
                      <Image
                        src={`${BASE_IMAGE_PROFILE}/${user.profile_picture}?v=${new Date().getTime()}`}
                        alt="Profile"
                        fill
                        className="object-cover"
                        unoptimized={true}
                        key={`header-profile-${user.profile_picture}-${new Date().getTime()}`}
                      />
                    ) : (
                      <User className="h-5 w-5 absolute inset-0 m-auto text-white" />
                    )}
                  </div>
                  <span className="hidden md:inline-block font-medium">{userName || "User"}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/cashier/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/cashier/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-700">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default SidebarComponent

