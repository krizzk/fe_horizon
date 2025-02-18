"use client";
import { useState, useEffect } from "react";
import { IMenu, ICart } from "@/app/types";
import { getCookie } from "@/lib/client-cookie";
import { BASE_API_URL } from "@/global";
import { get, post } from "@/lib/api-bridge"; // Assuming you have a post method for API requests
import { AlertInfo } from "@/components/alert/index";
import Search from "./search";
import CardComponent from "./card";
import { useSearchParams } from "next/navigation";

const getMenu = async (search: string, token: string): Promise<IMenu[]> => {
  try {
    const url = `${BASE_API_URL}/menu?search=${search}`;
    const { data } = await get(url, token);
    return data?.status ? data.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

const saveCartToServer = async (cart: ICart[], token: string) => {
  try {
    const url = `${BASE_API_URL}/cart`;
    const formData = new FormData();
    formData.append("cart", JSON.stringify(cart)); // Serialize cart array to JSON string
    await post(url, formData, token);
  } catch (error) {
    console.log(error);
  }
};

const MenuPage = () => {
  const searchParams = useSearchParams(); // Menggunakan hook untuk mengambil search params
  const search = searchParams.get("search") || ""; // Mengambil nilai parameter search

  const [menu, setMenu] = useState<IMenu[]>([]);
  const [cart, setCart] = useState<ICart[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const token = getCookie("token") || "";
    const fetchMenu = async () => {
      const data = await getMenu(search, token);
      setMenu(data);
    };
    fetchMenu();
  }, [search]);

  const renderCategory = (cat: string): React.ReactNode => {
    switch (cat) {
      case "FOOD":
        return (
          <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
            Food
          </span>
        );
      case "SNACK":
        return (
          <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
            Snack
          </span>
        );
      default:
        return (
          <span className="bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
            Drink
          </span>
        );
    }
  };

  const handleAddToCart = (menuItem: IMenu) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.menuId === menuItem.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({
        menuId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        note: "",
      });
    }

    setCart(updatedCart);
    setTotal((prevTotal) => prevTotal + menuItem.price);
    const token = getCookie("token") || "";
    saveCartToServer(updatedCart, token);
  };

  const handleRemoveFromCart = (menuItem: IMenu) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find((item) => item.menuId === menuItem.id);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        setTotal((prevTotal) => prevTotal - menuItem.price);
      } else {
        const index = updatedCart.indexOf(existingItem);
        updatedCart.splice(index, 1);
        setTotal((prevTotal) => prevTotal - menuItem.price);
      }
      setCart(updatedCart);
      const token = getCookie("token") || "";
      saveCartToServer(updatedCart, token);
    }
  };

  const handleCheckout = () => {
    alert(`Total: Rp${total} - Proceeding to checkout...`);
  };

  return (
    <div className="m-4 bg-blue-50 rounded-lg p-6 border-t-4 border-t-blue-700 shadow-lg">
      <h4 className="text-2xl font-bold text-blue-700 mb-4">Menu Data</h4>
      <p className="text-sm text-blue-600 mb-6">
        This page displays menu data, allowing users to view details, search,
        and manage menu items by adding, editing, or deleting them.
      </p>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center w-full max-w-md">
          <Search url={`/cashier/pesan_makanan`} search={search} />
        </div>
      </div>

      {menu.length === 0 ? (
        <AlertInfo title="Informasi">No data available</AlertInfo>
      ) : (
        <div className="flex">
          <div className="w-2/3 grid grid-cols-2 gap-4">
            {menu.map((data, index) => {
              const itemInCart = cart.find((item) => item.menuId === data.id) || null;
              return (
                <CardComponent
                  key={`keyMenu${index}`}
                  data={data}
                  itemInCart={itemInCart}
                  handleAddToCart={handleAddToCart}
                  handleRemoveFromCart={handleRemoveFromCart}
                  renderCategory={renderCategory}
                />
              );
            })}
          </div>

          {/* Transaction Section on the right */}
          <div className="w-1/3 ml-6">
            <h4 className="text-xl font-bold text-blue-700 mb-4">
              Transaction
            </h4>
            <div className="bg-white p-4 shadow-md rounded-lg">
              <div className="flex flex-col gap-2">
                {cart.map((cartItem) => (
                  <div key={cartItem.menuId} className="flex justify-between">
                    <span>{cartItem.name}</span>
                    <span>
                      {cartItem.quantity} x Rp{cartItem.price}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <h5 className="text-lg font-semibold">Total</h5>
                <span className="text-lg font-semibold text-red-600">
                  Rp{total}
                </span>
              </div>
              <button
                className="bg-blue-500 text-white p-2 rounded-full w-full mt-4"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
