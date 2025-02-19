"use client";
import React, { useState } from 'react';
import { IMenu } from "@/app/types";
// import { getCookies } from "@/lib/server-cookies"; 
import { AlertInfo } from "@/components/alert";
import Search from "./search";
import MenuList from './card';
import useMenuData from './useMenuData';

const MenuPage: React.FC<{ searchParams: { [key: string]: string | string[] | undefined } }> = ({ searchParams }) => {
  const search = searchParams.search ? searchParams.search.toString() : ``;   
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const menu = useMenuData(search);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <div className="m-2 bg-white rounded-lg p-3 border-t-4 border-t-primary shadow-md"> 
        <h4 className="text-xl font-bold mb-2 text-gray-900">Menu data</h4>
        <p className="text-sm text-secondary mb-4 text-gray-900">
          This page displays menu data, allowing managers to view details, search, and manage menu accounts by adding, editing, or deleting them.
        </p>
        <div className="flex justify-between items-center mb-4">
          {/* Search Bar */}
          <div className="flex items-center w-full max-w-md flex-grow text-black">
            <Search url={`/cashier/menu`} search={search} />
          </div>
          {/* Add menu Button */}
          <div className="ml-4">
            {/* <AddMenu /> */}
          </div>

          {/* Category Filter */}
          <div className="flex items-center">
            <button 
              onClick={() => handleCategoryChange("ALL")} 
              className={`category-button ${selectedCategory === "ALL" ? "active" : ""}`}
            >
              All
            </button>
            <button 
              onClick={() => handleCategoryChange("FOOD")} 
              className={`category-button ${selectedCategory === "FOOD" ? "active" : ""}`}
            >
              Food
            </button>
            <button 
              onClick={() => handleCategoryChange("DRINK")} 
              className={`category-button ${selectedCategory === "DRINK" ? "active" : ""}`}
            >
              Drink
            </button>
            <button 
              onClick={() => handleCategoryChange("SNACK")} 
              className={`category-button ${selectedCategory === "SNACK" ? "active" : ""}`}
            >
              Snack
            </button>
          </div>
        </div>
        {menu.length === 0 ? (
          <AlertInfo title="Information">
            No data Available
          </AlertInfo>
        ) : (
          <div className="m-2">
            <MenuList search={search} selectedCategory={selectedCategory} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;



//ini benarrrrrrrrr
// "use client";
// import React, { useState } from 'react';
// import { IMenu } from "@/app/types";
// import { getCookies } from "@/lib/server-cookies";
// import { AlertInfo } from "@/components/alert";
// import Search from "./search";
// import MenuList from './card';
// import useMenuData from './useMenuData';

// const MenuPage: React.FC<{ searchParams: { [key: string]: string | string[] | undefined } }> = ({ searchParams }) => {
//   const search = searchParams.search ? searchParams.search.toString() : ``;   
//   const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

//   const menu = useMenuData(search);

//   const handleCategoryChange = (category: string) => {
//     setSelectedCategory(category);
//   };

//   return (
//     <div>
//       <div className="m-2 bg-white rounded-lg p-3 border-t-4 border-t-primary shadow-md"> 
//         <h4 className="text-xl font-bold mb-2 text-gray-900">Menu data</h4>
//         <p className="text-sm text-secondary mb-4 text-gray-900">
//           This page displays menu data, allowing managers to view details, search, and manage menu accounts by adding, editing, or deleting them.
//         </p>
//         <div className="flex justify-between items-center mb-4">
//           {/* Search Bar */}
//           <div className="flex items-center w-full max-w-md flex-grow text-black">
//             <Search url={`/cashier/menu`} search={search} />
//           </div>
//           {/* Add menu Button */}
//           <div className="ml-4">
//             {/* <AddMenu /> */}
//           </div>
//           {/* Category Filter */}
//           <div className="flex items-center">
//             <button onClick={() => handleCategoryChange("ALL")} className="category-button ">All</button>
//             <button onClick={() => handleCategoryChange("FOOD")} className="category-button">Food</button>
//             <button onClick={() => handleCategoryChange("DRINK")} className="category-button">Drink</button>
//             <button onClick={() => handleCategoryChange("SNACK")} className="category-button">Snack</button>
//           </div>
//         </div>
//         {menu.length === 0 ? (
//           <AlertInfo title="Information">
//             No data Available
//           </AlertInfo>
//         ) : (
//           <div className="m-2">
//             <MenuList search={search} selectedCategory={selectedCategory} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MenuPage;


// import React from 'react';
// import { IMenu } from "@/app/types";
// import { getCookies } from "@/lib/server-cookies";
// import { BASE_API_URL } from "@/global";
// import { get } from "@/lib/api-bridge";
// import { AlertInfo } from "@/components/alert";
// import Search from "./search";
// import MenuList from './card';

// const getMenu = async (search: string): Promise<IMenu[]> => {
//   try {
//     const TOKEN = await getCookies("token");
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

// const MenuPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
//   const search = searchParams.search ? searchParams.search.toString() : ``;   
//   const menu = await getMenu(search);

//   return (
//     <div>
//       <div className="m-2 bg-white rounded-lg p-3 border-t-4 border-t-primary shadow-md"> 
//         <h4 className="text-xl font-bold mb-2 text-gray-900">Menuss</h4>
//         {/* <p className="text-sm text-secondary mb-4 text-gray-900">
//           This page displays menu data, allowing managers to view details, search, and manage menu accounts by adding, editing, or deleting them.
//         </p> */}
//         <div className="flex justify-between items-center mb-4">
//           {/* Search Bar */}
//           <div className="flex items-center w-full max-w-md flex-grow text-black">
//             <Search url={`/cashier/menu`} search={search} />
//           </div>
//           {/* Add menu Button */}
//           <div className="ml-4">
//             {/* <AddMenu /> */}
//           </div>
//         </div>
//         {menu.length === 0 ? (
//           <AlertInfo title="Information">
//             No data Available
//           </AlertInfo>
//         ) : (
//           <div className="m-2">
//             <MenuList search={search} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MenuPage;
