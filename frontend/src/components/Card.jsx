import React from "react";
import VegSymbol from "./category-symbol";
import { useCartContext } from "../context/CartProvider";

function Card({ _id, image, name, description, category, price }) {
  const { cartItems, addToCart, removeFromCart } = useCartContext();

  const cartItem = cartItems.find((item) => item.id === _id);
  const quantity = cartItem ? cartItem.quantity : 0;

  // Treat items as veg if category is "veg" or "drinks"
  const isVegOrDrink = category === "veg" || category === "drinks";
  const color = isVegOrDrink ? "text-green-800" : "text-red-600";

  // Calculate fake price: 10% higher
  const fakePrice = price ? (price * 1.1).toFixed(2) : null;

  return (
    <div className="flex h-auto p-4 space-x-4 border-b border-gray-600">
      <div className="w-20 h-20 flex-shrink-0">
        <img
  src={`http://localhost:5000/uploads/${image}`}
  alt={name}
  className="w-full h-full object-cover rounded"
/>

      </div>

      <div className="flex-1 flex flex-col justify-between space-y-1 break-words">
        <div className={`flex items-center space-x-1 ${color}`}>
          <VegSymbol color={isVegOrDrink ? "green" : "red"} size={12} />
          <h2 className="text-sm font-semibold">
            {isVegOrDrink ? "Veg" : "Non-Veg"}
          </h2>
        </div>
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-xs text-gray-700 whitespace-pre-wrap">{description}</p>
        <div className="flex items-center space-x-2">
          {fakePrice && (
            <p className="text-xs text-gray-500 line-through">₹{fakePrice}</p>
          )}
          <p className="font-semibold">₹{price?.toFixed(2)}</p>
        </div>
      </div>

      <div className="min-w-[80px] flex-shrink-0">
        {quantity === 0 ? (
          <button
            onClick={() =>
              addToCart({ id: _id, image, name, description, isVeg: isVegOrDrink, price })
            }
            className="bg-red-500 text-white px-4 py-1.5 rounded-full w-full text-sm text-center"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center justify-between bg-red-700 text-white px-2 py-1.5 rounded-full w-full text-sm">
            <button onClick={() => removeFromCart(_id)} className="px-1 font-bold">−</button>
            <span className="px-2">{quantity}</span>
            <button
              onClick={() =>
                addToCart({ id: _id, image, name, description, isVeg: isVegOrDrink, price })
              }
              className="px-1 font-bold"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
