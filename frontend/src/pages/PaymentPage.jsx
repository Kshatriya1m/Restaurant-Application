import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;
  const [loadingRedirect, setLoadingRedirect] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    console.log("🧭 Received state data from location:", data);
    if (!data || !data.cartItems || !data.userDetails || !data.totalPrice) {
      setLoadingRedirect(true);
      setTimeout(() => {
        navigate("/checkout", { replace: true });
      }, 1000);
    }
  }, [data, navigate]);

  if (loadingRedirect) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        <style>{`
          .loader {
            border-top-color: #3498db;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}</style>
      </div>
    );
  }

  if (!data || !data.cartItems || !data.userDetails || !data.totalPrice) {
    return null;
  }

  const { cartItems, userDetails, totalPrice } = data;
  const upiId = "7465942719@ybl";

  const upiUrl = `upi://pay?pa=${upiId}&am=${totalPrice.toFixed(
    2
  )}&cu=INR&pn=${encodeURIComponent(userDetails.name)}`;

  const handleOrderSubmit = async (paymentMethod) => {
    try {
      setProcessing(true);

      const orderPayload = {
        userDetails,
        items: cartItems,
        totalPrice,
        paymentMethod,
        status: "placed",
      };

      console.log("📦 Submitting order to backend:", orderPayload);

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const responseData = await response.json();
      console.log("✅ Order submission response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit order");
      }

      navigate("/order-confirmation", {
        state: { order: responseData },
        replace: true,
      });
    } catch (error) {
      console.error("❌ Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
      setProcessing(false);
    }
  };

  const handlePayNow = async () => {
    console.log("💰 Pay Now button clicked");
    await handleOrderSubmit("upi");
  };

  const handlePayOnTable = async () => {
    console.log("🪑 Pay on Table button clicked");
    await handleOrderSubmit("pay_on_table");
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(`UPI ID: ${upiId}\nAmount: ₹${totalPrice.toFixed(2)}`)
      .then(() => {
        setCopySuccess("Copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch(() => {
        setCopySuccess("Failed to copy");
        setTimeout(() => setCopySuccess(""), 2000);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-12">
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Confirm & Pay
        </h2>

        <div className="space-y-4 text-gray-700 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Name:</span>
            <span>{userDetails.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Table Number:</span>
            <span>{userDetails.tableNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Items in Order:</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="flex justify-between border-t pt-3 font-semibold text-base">
            <span>Total Amount (incl. GST):</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="my-6 flex justify-center">
          <div
            style={{
              background: "white",
              padding: 16,
              borderRadius: 8,
              boxShadow: "0 0 8px rgba(0,0,0,0.1)",
            }}
          >
            <QRCode value={upiUrl} size={180} />
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mb-2">
          Scan this QR code with your UPI app to pay ₹{totalPrice.toFixed(2)}
        </p>

        <div className="text-center mb-4">
          <button
            onClick={copyToClipboard}
            className="text-blue-500 underline text-sm"
          >
            Copy UPI Details
          </button>
          {copySuccess && (
            <p className="text-green-500 text-xs mt-1">{copySuccess}</p>
          )}
        </div>

        <button
          onClick={handlePayNow}
          className="w-full mt-2 bg-red-400 hover:bg-red-500 text-white font-semibold py-2 rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={processing}
          aria-label="Confirm payment after paying via UPI"
        >
          {processing ? "Processing..." : "Confirm Payment (I have paid)"}
        </button>

        <button
          onClick={handlePayOnTable}
          className="w-full mt-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded transition disabled:bg-gray-200 disabled:cursor-not-allowed"
          disabled={processing}
          aria-label="Choose to pay on table"
        >
          {processing ? "Processing..." : "Pay on Table"}
        </button>

        <button
          onClick={() => {
            console.log("🔙 Going back to review page");
            navigate("/checkout/review");
          }}
          className="mt-4 w-full text-sm text-gray-600 underline hover:text-black"
          aria-label="Go back to order review page"
          disabled={processing}
        >
          Go Back to Review
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
