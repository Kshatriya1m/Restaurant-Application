import React, { useState } from "react";
import { useCartContext } from "../context/CartProvider";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../components/OrderSummary";

function OrderReviewPage({ userDetails }) {
  const { cartItems } = useCartContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add items to proceed.");
      return;
    }
    setError("");

    // Calculate total price with 18% GST
    const baseTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const GST_RATE = 0.18;
    const totalPrice = baseTotal + baseTotal * GST_RATE;

    navigate("/payment", {
      state: {
        cartItems,
        userDetails,
        totalPrice,
      },
    });
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 px-4 py-8">
      <main className="p-6 bg-white rounded-lg shadow max-w-xl w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-1">Review Your Order</h2>
          <p className="text-gray-700">
            <strong>Name:</strong> {userDetails.name || "Guest"}
            <br />
            <strong>Table Number:</strong> {userDetails.tableNumber || "—"}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-center text-red-500 font-semibold my-8">
            Your cart is empty.
          </p>
        ) : (
          <OrderSummary items={cartItems} />
        )}

        {error && (
          <p className="text-red-600 font-medium text-center mt-4">{error}</p>
        )}

        <button
          onClick={handleProceedToPayment}
          className={`mt-6 w-full text-white px-5 py-3 rounded 
            ${
              cartItems.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-400 hover:bg-red-600"
            }`}
          disabled={cartItems.length === 0}
        >
          Proceed to Payment
        </button>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/checkout")}
            className="text-gray-700 underline"
          >
            Back to Menu
          </button>
        </div>
      </main>
    </div>
  );
}

export default OrderReviewPage;
