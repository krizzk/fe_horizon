"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { BASE_API_URL, BASE_IMAGE_MENU } from '@/global';
import { IMenu } from '@/app/types';
import { get } from '@/lib/api-bridge';
import { getCookie } from "@/lib/client-cookie";
import useMenuData from './useMenuData';

const getMenu = async (search: string): Promise<IMenu[]> => {
  try {
    const TOKEN = await getCookie("token") || "";
    const url = `${BASE_API_URL}/menu?search=${search}`;
    const { data } = await get(url, TOKEN);
    let result: IMenu[] = [];
    if (data?.status) result = [...data.data];
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

interface MenuCardProps {
  menu: IMenu;
}

const MenuCard: React.FC<MenuCardProps> = ({ menu }) => {
  const [quantity, setQuantity] = useState(0);

  const incrementQty = () => setQuantity(quantity + 1);
  const decrementQty = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  return (
    <div className="menu-card flex flex-col items-center">
      <div className="image-container w-full">
        {menu.picture ? (
          <Image 
            width={240} 
            height={240} 
            src={`${BASE_IMAGE_MENU}/${menu.picture}`} 
            className="rounded-sm overflow-hidden" 
            alt="preview" 
            unoptimized 
            onError={(e) => (e.currentTarget.src = '/fallback-image.png')} 
          />
        ) : (
          <span>No image</span>
        )}
      </div>
      <div className="text-container text-center font-semibold mb-2">
        {menu.name}
      </div>
      <div className="text-container text-center text-gray-600 mb-2">
        {menu.description}
      </div>
      <div className="text-center mb-2">
        {menu.price}
      </div>
      <div className="text-center mb-2 ml-2">
        <CategoryBadge category={menu.category} />
      </div>
      <div className="qty-buttons flex justify-center items-center border border-gray-300 rounded px-2 py-1">
        <button onClick={decrementQty}>-</button>
        <span className="mx-2">{quantity}</span>
        <button  onClick={incrementQty}>+</button>
      </div>
    </div>
  );
};
    
interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  if (category === "FOOD") {
    return <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-white">Food</span>;
  }
  if (category === "SNACK") {
    return <span className="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-white">Snack</span>;
  }
  return <span className="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-white">Drink</span>;
};

interface MenuListProps {
  search: string;
  selectedCategory: string;
}

const MenuList: React.FC<MenuListProps> = ({ search, selectedCategory }) => {
  const menuData: IMenu[] = useMenuData(search);

  const filteredMenuData = selectedCategory === "ALL"
    ? menuData
    : menuData.filter(menu => menu.category === selectedCategory);

  return (
    <div className="menu-list flex flex-wrap justify-start">
      {filteredMenuData.map((menu) => ( 
        <MenuCard key={menu.id} menu={menu} />
      ))}
    </div>
  );
};

export default MenuList;


// "use client";
// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { BASE_API_URL, BASE_IMAGE_MENU } from '@/global';
// import { IMenu } from '@/app/types';
// import { get } from '@/lib/api-bridge';
// import { getCookie } from "@/lib/client-cookie";

// const getMenu = async (search: string): Promise<IMenu[]> => {
//   try {
//     const TOKEN = await getCookie("token") || "";
//     const url = `${BASE_API_URL}/menu?search=${search}`;
//     const { data } = await get(url, TOKEN);
//     let result: IMenu[] = [];
//     if (data?.status) result = [...data.data];
//     return result;
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// };

// interface MenuCardProps {
//   menu: IMenu;
// }

// const MenuCard: React.FC<MenuCardProps> = ({ menu }) => {
//   const [quantity, setQuantity] = useState(0);

//   const incrementQty = () => setQuantity(quantity + 1);
//   const decrementQty = () => {
//     if (quantity > 0) setQuantity(quantity - 1);
//   };

//   return (
//     <div className="menu-card flex flex-col items-center">
//       <div className="image-container w-full">
//         {menu.picture ? (
//           <Image 
//             width={240} 
//             height={240} 
//             src={`${BASE_IMAGE_MENU}/${menu.picture}`} 
//             className="rounded-sm overflow-hidden" 
//             alt="preview" 
//             unoptimized 
//             onError={(e) => (e.currentTarget.src = '/fallback-image.png')} 
//           />
//         ) : (
//           <span>No image</span>
//         )}
//       </div>
//       <div className="text-container text-center font-semibold mb-2">
//         {menu.name}
//       </div>
//       <div className="text-container text-center text-gray-600 mb-2">
//         {menu.description}
//       </div>
//       <div className="text-center mb-2">
//         {menu.price}
//       </div>
//       <div className="text-center mb-2 ml-2">
//         <CategoryBadge category={menu.category} />
//       </div>
//       <div className="qty-buttons flex justify-center items-center border border-gray-300 rounded px-2 py-1">
//         <button onClick={decrementQty}>-</button>
//         <span className="mx-2">{quantity}</span>
//         <button onClick={incrementQty}>+</button>
//       </div>
//     </div>
//   );
// };
    
// interface CategoryBadgeProps {
//   category: string;
// }

// const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
//   if (category === "FOOD") {
//     return <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-white">Food</span>;
//   }
//   if (category === "SNACK") {
//     return <span className="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-white">Snack</span>;
//   }
//   return <span className="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-white">Drink</span>;
// };

// const MenuList: React.FC<{ search: string }> = ({ search }) => {
//   const [menuData, setMenuData] = useState<IMenu[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getMenu(search);
//       setMenuData(data);
//     };

//     fetchData();
//   }, [search]);

//   return (
//     <div className="menu-list flex flex-wrap justify-start">
//       {menuData.map((menu) => (
//         <MenuCard key={menu.id} menu={menu} />
//       ))}
//     </div>
//   );
// };

// export default MenuList;
