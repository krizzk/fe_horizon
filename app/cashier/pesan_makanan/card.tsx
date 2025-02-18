import React from "react";
import Image from "next/image";
import { BASE_IMAGE_MENU } from "@/global";
import { ICart, IMenu } from "@/app/types";

interface CardComponentProps {
  data: IMenu;
  itemInCart: ICart | null;
  handleAddToCart: (menuItem: IMenu) => void;
  handleRemoveFromCart: (menuItem: IMenu) => void;
  renderCategory: (cat: string) => React.ReactNode;
}

const CardComponent: React.FC<CardComponentProps> = ({
  data,
  itemInCart,
  handleAddToCart,
  handleRemoveFromCart,
  renderCategory,
}) => {
  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-center mb-4">
        <Image
          width={400}
          height={300}
          src={`${BASE_IMAGE_MENU}/${data.picture}`}
          className="rounded-sm overflow-hidden w-full h-48 object-cover"
          alt="Menu image"
          unoptimized
        />
      </div>
      <div className="mb-2 text-center">
        <h5 className="text-xl font-semibold text-blue-800">{data.name}</h5>
        <p className="text-gray-600">{data.description}</p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-red-600">Rp{data.price}</span>
        <div className="flex gap-1">
          <button
            className="bg-green-500 text-white p-2 rounded-full"
            onClick={() => handleAddToCart(data)}
          >
            +
          </button>
          <span className="text-blue-700">{itemInCart ? itemInCart.quantity : 0}</span>
          <button
            className="bg-red-500 text-white p-2 rounded-full"
            onClick={() => handleRemoveFromCart(data)}
          >
            -
          </button>
        </div>
      </div>
      <div className="flex justify-center">{renderCategory(data.category)}</div>
    </div>
  );
};

export default CardComponent;
