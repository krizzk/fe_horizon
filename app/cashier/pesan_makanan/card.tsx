"use client"

import React from "react"
import Image from "next/image"
import { BASE_IMAGE_MENU } from "@/global"
import type { ICart, IMenu } from "../../types"
import { FaBowlRice } from "react-icons/fa6"

interface CardComponentProps {
  data: IMenu
  itemInCart: ICart | null
  handleAddToCart: (menuItem: IMenu) => void
  handleRemoveFromCart: (menuItem: IMenu) => void
}

interface CategoryBadgeProps {
  category: string
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  switch (category) {
    case "FOOD":
      return (
        <span className="bg-yellow-200 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Food</span>
      )
    case "SNACK":
      return (
        <span className="bg-orange-200 text-orange-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Snack</span>
      )
    default:
      return (
        <span className="bg-amber-300 text-amber-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Drink</span>
      )
  }
}

const CardComponent: React.FC<CardComponentProps> = ({ data, itemInCart, handleAddToCart, handleRemoveFromCart }) => {
  // Create a memoized handler to prevent double clicks
  const handleAdd = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleAddToCart(data)
    },
    [data, handleAddToCart],
  )

  const handleRemove = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleRemoveFromCart(data)
    },
    [data, handleRemoveFromCart],
  )

  return (
    <div className="bg-[#FFF5EE] rounded-2xl p-4 transition-transform hover:scale-[1.02] flex flex-col h-full">
      {/* MENU PICTURE */}
      <div className="relative aspect-square mb-3">
        {data.picture ? (
          <Image
            src={`${BASE_IMAGE_MENU}/${data.picture}`}
            layout="fill"
            className="object-cover rounded-xl"
            alt={data.name}
          />
        ) : (
          <div className="items-center grid justify-items-center w-full h-full rounded-xl">
            <FaBowlRice size={180} />
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col">
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-lg text-black">{data.name}</h3>
            <CategoryBadge category={data.category} />
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{data.description}</p>
        </div>

        <div className="mt-auto">
          {/* Price */}
          <p className="font-bold text-gray-900 mb-2">
            Rp.{data.price.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>

          {/* Quantity controls */}
          <div className="flex items-center justify-end gap-2">
            {itemInCart && itemInCart.quantity > 0 && (
              <>
                <button
                  type="button"
                  className="w-6 h-6 rounded-full p-0 text-sm bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                  onClick={handleRemove}
                >
                  -
                </button>
                <span className="w-4 text-center text-black">{itemInCart.quantity}</span>
              </>
            )}
            <button
              type="button"
              className="w-6 h-6 rounded-full p-0 text-sm bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
              onClick={handleAdd}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardComponent

