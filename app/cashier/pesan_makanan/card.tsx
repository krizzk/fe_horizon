import type React from "react";
import Image from "next/image";
import { BASE_IMAGE_MENU } from "@/global";
import type { ICart, IMenu } from "../../types";
import Button from "./button";
import { FaBowlRice } from "react-icons/fa6";

interface CardComponentProps {
  data: IMenu;
  itemInCart: ICart | null;
  handleAddToCart: (menuItem: IMenu) => void;
  handleRemoveFromCart: (menuItem: IMenu) => void;
}

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  if (category === "FOOD") {
    return (
      <span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-white">
        Food
      </span>
    );
  }
  if (category === "SNACK") {
    return (
      <span className="bg-indigo-100 text-indigo-950 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-indigo-950 dark:text-white">
        Snack
      </span>
    );
  }
  return (
    <span className="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-purple-900 dark:text-white">
      Drink
    </span>
  );
};

const CardComponent: React.FC<CardComponentProps> = ({
  data,
  itemInCart,
  handleAddToCart,
  handleRemoveFromCart,
}) => {
  return (
    <div className="bg-[#FFF5EE] rounded-2xl p-4 transition-transform hover:scale-[1.02]">
      {/* MENU PICTURE */}
      <div className="relative aspect-square mb-3">
          {data.picture ? (
            <Image src={`${BASE_IMAGE_MENU}/${data.picture}`} layout="fill" className="object-cover rounded-xl" alt={data.name} />
          ) : (
            <div className="items-center grid justify-items-center w-full h-full rounded-xl">
           <FaBowlRice  size={180}/>
            <div className="font-semibold text-black rounded-b-lg">
              No Image
            </div>
            </div>
          )}
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold ">{data.name}</h3>
          <CategoryBadge category={data.category} />
        </div>
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-900">
            Rp.{data.price.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            {/* <span className="text-gray-500 line-through text-sm ml-2">Rp.{(data.price * 1.2).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> */}
          </p>
          <div className="flex items-center gap-2">
            {itemInCart && itemInCart.quantity > 0 && (
              <>
                <Button
                  variant="add"
                  className="w-6 h-6 rounded-full p-0"
                  onClick={() => handleRemoveFromCart(data)}
                >
                  -
                </Button>
                <span className="w-4 text-center">{itemInCart.quantity}</span>
              </>
            )}
            <Button variant="add" onClick={() => handleAddToCart(data)}>
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;




// import React from "react";
// import Image from "next/image";
// import { BASE_IMAGE_MENU } from "@/global";
// import { ICart, IMenu } from "@/app/types";

// interface CardComponentProps {
//   data: IMenu;
//   itemInCart: ICart | null;
//   handleAddToCart: (menuItem: IMenu) => void;
//   handleRemoveFromCart: (menuItem: IMenu) => void;
//   renderCategory: (cat: string) => React.ReactNode;
// }

// const CardComponent: React.FC<CardComponentProps> = ({
//   data,
//   itemInCart,
//   handleAddToCart,
//   handleRemoveFromCart,
//   renderCategory,
// }) => {
//   return (
//     <div className="flex flex-col bg-white shadow-md rounded-lg p-4">
//       <div className="flex justify-center mb-4">
//         <Image
//           width={400}
//           height={300}
//           src={`${BASE_IMAGE_MENU}/${data.picture}`}
//           className="rounded-sm overflow-hidden w-full h-48 object-cover"
//           alt="Menu image"
//           unoptimized
//         />
//       </div>
//       <div className="mb-2 text-center">
//         <h5 className="text-xl font-semibold text-blue-800">{data.name}</h5>
//         <p className="text-gray-600">{data.description}</p>
//       </div>
//       <div className="flex justify-between items-center mb-4">
//         <span className="text-lg font-semibold text-red-600">Rp{data.price}</span>
//         <div className="flex gap-1">
//           <button
//             className="bg-green-500 text-white p-2 rounded-full"
//             onClick={() => handleAddToCart(data)}
//           >
//             +
//           </button>
//           <span className="text-blue-700">{itemInCart ? itemInCart.quantity : 0}</span>
//           <button
//             className="bg-red-500 text-white p-2 rounded-full"
//             onClick={() => handleRemoveFromCart(data)}
//           >
//             -
//           </button>
//         </div>
//       </div>
//       <div className="flex justify-center">{renderCategory(data.category)}</div>
//     </div>
//   );
// };

// export default CardComponent;
