import React from "react";
import { useCartContext } from "../context/CartProvider";
import { useNavigate } from "react-router-dom";

function Footer() {
  const { cartItems } = useCartContext();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout/review");
  };

  return (
    <div className="bg-white fixed bottom-0 w-full text-black p-4 z-50 shadow-md">
      <hr className="mb-3" />
      <div className="flex justify-between items-center">
        <div>
          <p>
            {totalItems} item{totalItems !== 1 ? "s" : ""} | ₹{" "}
            {totalPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs text-gray-600">incl. Taxes</p>
        </div>
        <button
          onClick={handleCheckout}
          className="bg-red-800 p-2 rounded-xl text-white hover:bg-red-700 transition disabled:opacity-50"
          disabled={cartItems.length === 0}
          title={cartItems.length === 0 ? "Your cart is empty" : "Proceed to Checkout"}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Footer;
