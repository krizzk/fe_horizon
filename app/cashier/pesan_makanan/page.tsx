"use client"
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import type { IMenu, ICart } from "../../types"
import { getCookie, storeCookie } from "@/lib/client-cookie"
import { BASE_API_URL, BASE_IMAGE_MENU } from "@/global"
import { get } from "@/lib/api-bridge"
import { AlertInfo } from "@/components/alert/index"
import Button from "./button"
import CardComponent from "./card"
import Search from "./search"
import { FaBowlRice } from "react-icons/fa6"
import AddOrder from "./add-order"

const categories = [
  { id: "ALL", label: "All", icon: "🕒" },
  { id: "FOOD", label: "Food", icon: "🍔" },
  { id: "DRINK", label: "Drinks", icon: "🥤" },
  { id: "SNACK", label: "Snacks", icon: "🍿" },
]

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

const MAX_NOTE_LENGTH = 100

const MenuPage: React.FC = () => {
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""

  const [menu, setMenu] = useState<IMenu[]>([])
  const [cart, setCart] = useState<ICart[]>([])
  const [total, setTotal] = useState<number>(0)
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL")
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [generalNote, setGeneralNote] = useState<string>("")

  const calculateTotal = useCallback((cartItems: ICart[] | null | undefined) => {
    if (!Array.isArray(cartItems)) return 0
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [])

  const saveCartToCookies = useCallback(
    (updatedCart: ICart[]) => {
      storeCookie("cart", JSON.stringify(updatedCart ))
    },
    [generalNote],
  )

  const updateCartAndCookies = useCallback(
    (newCart: ICart[], newNote: string) => {
      setCart(newCart)
      setGeneralNote(newNote)
      setTotal(calculateTotal(newCart))
      saveCartToCookies(newCart)
    },
    [calculateTotal, saveCartToCookies],
  )

  const handleAddToCart = useCallback(
    (menuItem: IMenu) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.menuId === menuItem.id)
        let updatedCart: ICart[]

        if (existingItem) {
          updatedCart = prevCart.map((item) =>
            item.menuId === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        } else {
          updatedCart = [
            ...prevCart,
            {
              menuId: menuItem.id,
              name: menuItem.name,
              price: menuItem.price,
              quantity: 1,
              note: "" ,
              picture: menuItem.picture,
            },
          ]
        }

        updateCartAndCookies(updatedCart, generalNote)
        return updatedCart
      })
    },
    [updateCartAndCookies, generalNote],
  )

  const handleRemoveFromCart = useCallback(
    (menuItem: IMenu) => {
      setCart((prevCart) => {
        const updatedCart = prevCart
          .map((item) => (item.menuId === menuItem.id ? { ...item, quantity: item.quantity - 1 } : item))
          .filter((item) => item.quantity > 0)
        updateCartAndCookies(updatedCart, generalNote)
        return updatedCart
      })
    },
    [updateCartAndCookies, generalNote],
  )

  const handleNoteChange = useCallback(
    (menuId: number, note: string) => {
      if (note.length <= MAX_NOTE_LENGTH) {
        setCart((prevCart) => {
          const updatedCart = prevCart.map((item) => (item.menuId === menuId ? { ...item, note } : item))
          updateCartAndCookies(updatedCart, generalNote)
          return updatedCart
        })
      }
    },
    [updateCartAndCookies, generalNote],
  )

  const handleGeneralNoteChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newNote = e.target.value
      if (newNote.length <= MAX_NOTE_LENGTH) {
        setGeneralNote(newNote)
        updateCartAndCookies(cart, newNote)
      }
    },
    [cart, updateCartAndCookies],
  )

  const handleOrderSuccess = useCallback(() => {
    setCart([])
    setTotal(0)
    setGeneralNote("")
    // Optionally clear the cart cookie if needed
    // removeCookie("cart")
  }, [])

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
  }, [])

  useEffect(() => {
    const token = getCookie("token") || ""
    const fetchMenu = async () => {
      try {
        const url = `${BASE_API_URL}/menu?search=${search}`
        const { data } = await get(url, token)
        setMenu(data?.status ? data.data : [])
      } catch (error) {
        console.error("Failed to fetch menu:", error)
        setMenu([])
      }
    }
    fetchMenu()

    const savedCart = getCookie("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        if (parsedCart && typeof parsedCart === "object") {
          if (Array.isArray(parsedCart.items)) {
            setCart(parsedCart.items)
            setTotal(calculateTotal(parsedCart.items))
            setGeneralNote(parsedCart.note || "")
          } else if (Array.isArray(parsedCart)) {
            // Handle old format where cart was stored as an array
            setCart(parsedCart)
            setTotal(calculateTotal(parsedCart))
          } else {
            console.error("Saved cart is not a valid format:", parsedCart)
            setCart([])
            setTotal(0)
            setGeneralNote("")
          }
        } else {
          console.error("Saved cart is not a valid object:", parsedCart)
          setCart([])
          setTotal(0)
          setGeneralNote("")
        }
      } catch (error) {
        console.error("Error parsing saved cart:", error)
        setCart([])
        setTotal(0)
        setGeneralNote("")
      }
    }

    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [search, calculateTotal])

  const filteredMenu = selectedCategory === "ALL" ? menu : menu.filter((item) => item.category === selectedCategory)

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <div className="relative w-full sm:w-auto sm:flex-1 max-w-md mb-4 sm:mb-0">
          <Search url="/cashier/pesan_makanan" search={search} />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="category"
              onClick={() => handleCategoryChange(category.id)}
              className={`mb-2 ${selectedCategory === category.id ? "bg-white shadow-md" : ""}`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-6`}>
        <div className={`${isMobile ? "w-full" : "flex-1"} overflow-y-auto`}>
          {menu.length === 0 ? (
            <AlertInfo title="Information">No menu items available</AlertInfo>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMenu.map((item, index) => (
                <CardComponent
                  key={`menu-${index}`}
                  data={item}
                  itemInCart={cart.find((cartItem) => cartItem.menuId === item.id) || null}
                  handleAddToCart={handleAddToCart}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              ))}
            </div>
          )}
        </div>

        <div className={`${isMobile ? "w-full" : "w-[380px] shrink-0"} ${!isMobile ? "sticky top-4 self-start" : ""}`}>
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Order Details:</h2>
            </div>

            <div className="space-y-4 mb-6 max-h-[calc(100vh-300px)] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.menuId} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="relative aspect-square mb-3">
                      {item.picture ? (
                        <div className="w-16 h-16 bg-[#FFF5EE] rounded-xl overflow-hidden relative">
                          <Image
                            fill
                            src={`${BASE_IMAGE_MENU}/${item.picture}`}
                            alt={item.name}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="items-center grid justify-items-center w-full h-full rounded-xl">
                          <FaBowlRice size={40} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="relative">
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 text-sm text-gray-700 border rounded-lg focus:outline-none pr-16"
                      placeholder="Add a note for this item..."
                      value={item.note || ""}
                      onChange={(e) => handleNoteChange(item.menuId, e.target.value)}
                      maxLength={MAX_NOTE_LENGTH}
                    />
                    <span className="absolute mr-3 top-2 right-2 text-xs text-gray-400">
                      {item.note.length}/{MAX_NOTE_LENGTH}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 bg-white">
              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              {/* Replace the Button with AddOrder component */}
              <AddOrder cart={cart} total={total} onOrderSuccess={handleOrderSuccess} formatPrice={formatPrice} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuPage

