
// import React from 'react';
// import Link from "next/link"

// interface MenuItemProps {
//     icon: React.ReactNode;
//     label: string;
//     path: string;
//     active?: boolean;
//     }

// const MenuItem = ({ icon, label, path, active }: MenuItemProps) => {
//     return (
//     <Link href={path} className={`glow-on-hover hover:transform hover:scale-105 flex items-center p-2 my-2 ${active ?
//     'text-primary' : 'text-gray'}`}>
//     <span className="mr-3">{icon}</span>
//     <span className="flex-1">{label}</span>
//     </Link>
//     );
// };

// export default MenuItem;

import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utilis"

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  path: string
  active?: boolean
}

const MenuItem = ({ icon, label, path, active }: MenuItemProps) => {
  return (
    <Link
      href={path}
      className={cn(
        "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
        active ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50 hover:text-orange-600",
      )}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

export default MenuItem

