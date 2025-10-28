import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Confetti from "react-confetti";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const orderItems = order?.items || [];
  const totalAmount = order?.totalPrice || 0;

  const [countdown, setCountdown] = useState(10);
  const [cancelRedirect, setCancelRedirect] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Update window size for Confetti
  useEffect(() => {
    const updateSize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Send order to backend on page load
  useEffect(() => {
    if (!order || !order.userDetails || !order.items || !order.totalPrice) return;

    const submitOrderToBackend = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userDetails: order.userDetails,
            cartItems: order.items,
            totalPrice: order.totalPrice,
            paymentMethod: order.paymentMethod || "pay_on_table",
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to submit order");

        console.log("✅ Order saved to backend:", data);
      } catch (err) {
        console.error("❌ Failed to submit order:", err.message || err);
      }
    };

    submitOrderToBackend();
  }, [order]);

  // Countdown redirect effect
  useEffect(() => {
    if (cancelRedirect) return;
    if (countdown === 0) {
      navigate("/", { replace: true });
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, cancelRedirect, navigate]);

  return (
    <div
      className="flex flex-col items-center justify-start pt-12 min-h-screen bg-gradient-to-tr from-green-50 to-green-100 px-4"
      aria-live="polite"
      role="alert"
    >
      <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} />
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full text-center animate-fadeIn">
        <CheckCircleIcon className="mx-auto h-20 w-20 text-green-500 mb-6" />
        <h2 className="text-4xl font-extrabold text-green-700 mb-4">
          Order Confirmed!
        </h2>
        <p className="text-gray-700 mb-6 text-lg">
          Thank you for your order. Your delicious food will be served shortly.
        </p>

        {/* Order Summary */}
        {orderItems.length > 0 && (
          <div className="mb-6 text-left border p-4 rounded bg-green-50">
            <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
            <ul className="mb-2 max-h-40 overflow-auto">
              {orderItems.map(({ id, name, quantity, price }) => (
                <li key={id} className="flex justify-between mb-1">
                  <span>{name} x {quantity}</span>
                  <span>₹{(price * quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <hr className="mb-2" />
            <div className="flex justify-between font-bold text-green-700">
              <span>Total:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <Link
          to="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300"
        >
          Back to Menu
        </Link>

        {!cancelRedirect && (
          <p className="mt-4 text-sm text-gray-600">
            Redirecting to menu in {countdown} second{countdown !== 1 ? "s" : ""}...
            <button
              onClick={() => setCancelRedirect(true)}
              className="ml-2 underline text-green-700 hover:text-green-900 focus:outline-none"
              aria-label="Cancel auto redirect"
            >
              Cancel
            </button>
          </p>
        )}

        {cancelRedirect && (
          <p className="mt-4 text-sm text-gray-600 font-semibold">
            Auto redirect canceled. You can navigate manually.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
