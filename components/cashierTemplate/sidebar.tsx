
// 'use client';
// import { ReactNode, useState, useEffect } from "react";
// import Image from "next/image";
// import MenuItem from "./menuItem";
// import Logo from '../../public/image/restaurant.jpg';
// import Profile from '../../public/image/profile.jpg';
// import { removeCookie, getCookie } from "@/lib/client-cookie";
// import { useRouter } from "next/navigation";
// import { IUser } from "@/app/types";
// import { BASE_IMAGE_PROFILE } from "@/global";

// type MenuType = {
//   id: string,
//   icon: ReactNode,
//   path: string,
//   label: string
// };

// type CashierProp = {
//   children: ReactNode,
//   id: string,
//   user: IUser | null,
//   title: string,
//   menuList: MenuType[]
// };

// const Sidebar = ({ children, id, title, menuList, user }: CashierProp) => {
//   const [isShow, setIsShow] = useState<boolean>(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [userName, setUserName] = useState<string>("");
//   const router = useRouter();

//   useEffect(() => {
//     const name = getCookie("name"); // Ambil nama pengguna dari cookie
//     if (name) {
//       setUserName(name); // Setel nama pengguna ke state
//     }
//   }, []);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleLogout = () => {
//     removeCookie("token");
//     removeCookie("id");
//     removeCookie("name");
//     removeCookie("role");
//     removeCookie("cart");
//     router.replace(`/login`);
//   };

//   return (
//     <div className="w-full min-h-dvh bg-white">
//       {/* header section */}
//       <header className="flex justify-between items-center p-4 mb-0 bg-yellow-500 border-b border-primary">
//         <div className="flex gap-2 ">
//           <button onClick={() => setIsShow(true)}>
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-black bg-yellow-500">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m16.5 4.5h16.5" />
//             </svg>
//           </button>
//           <h1 className="font-bold text-xl text-black">
//             {title}
//           </h1>
//         </div>

//         <div className="relative">
//           <button onClick={toggleDropdown} className="flex itemscenter space-x-2 text-black">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25 2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
//             </svg>
//             <span className="font-bold">Logout</span>
//           </button>
//           {isDropdownOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-black rounded-md shadow-lg py-1 z-10 top-full">
//               <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-black">Profile</a>
//               <a href="#" className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-black">Settings</a>
//               <a onClick={handleLogout} className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-black">Logout</a>
//             </div>
//           )}
//         </div>
//       </header>
//       {/* end header section */}
//       {/* content section */}
//       <div className="p-4">
//         {children}
//       </div>
//       {/* end content section */}
      
//       {/* sidebar section */}
//       <div className={`backdrop-blur-md flex flex-col w-2/3 md:w-1/3 lg:w-1/5 h-full fixed top-0 right-full transition-transform z-50 bg-gray-100 border-r border-primary rounded-r-[20px] bg-opacity-60 ${isShow ? `translate-x-full sidebar-glow` : ``}`}>
//         {/* close button */}
//         <div className="ml-auto p-2">
//           <button onClick={() => setIsShow(false)}>
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 ">
//               <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1- 18 0 9 9 0 0 1 18 0Z" />
//             </svg>
//           </button>
//         </div>
//         {/* end close button */}

//         {/* logo section */}
//         <div className="mb-3 w-full flex justify-center ">
//           <div className="flex items-center space-x-2">
//             <Image src={Logo} alt="Logo" width={40} height={40} className="rounded-full" />
//             <h1 className="text-2xl font-bold text-gray-800">Restaurant lama saji</h1>
//           </div>
//         </div>
//         {/* end logo section */}

//         {/* user section */}
//         <div className="w-full mt-10 mb-6 bg-primary text-black p-3 flex gap-2 items-center ">
//           {user?.profile_picture ? (
//             <Image src={`${BASE_IMAGE_PROFILE}/${user?.profile_picture}`} alt="Profile" width={40} height={40} className="rounded-full" />
//           ) : (
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
//             </svg>
//           )}
//           <div className="text-sm font-semibold">
//             {userName}
//           </div>
//         </div>
//         {/* end user section */}

//         {/* menu section */}
//         <div className="w-full p-2 overflow-y-auto">
//           <div className="px-5">
//             {menuList.map((menu, index) => (
//               <MenuItem icon={menu.icon} label={menu.label} path={menu.path} active={menu.id === id} key={`keyMenu${index}`} />
//             ))}
//           </div>
//         </div>
//         {/* menu section */}
//       </div>
//       {/* end sidebar section */}
//     </div>
//   )
// }
// export default Sidebar;


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
  const router = useRouter()

  useEffect(() => {
    const name = getCookie("name")
    if (name) {
      setUserName(name)
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
                    src={`${BASE_IMAGE_PROFILE}/${user.profile_picture}`}
                    alt="Profile"
                    fill
                    className="object-cover"
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
                        src={`${BASE_IMAGE_PROFILE}/${user.profile_picture}`}
                        alt="Profile"
                        fill
                        className="object-cover"
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

