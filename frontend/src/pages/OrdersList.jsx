import React, { useEffect, useState } from "react";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null); // For loading state on update

  function getTimestampFromObjectId(objectId) {
    const timestampHex = objectId.substring(0, 8);
    const timestamp = parseInt(timestampHex, 16);
    return new Date(timestamp * 1000);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Toggle order status handler
  const toggleOrderStatus = async (orderId, currentStatus) => {
    const newStatus = currentStatus === "done" ? "placed" : "done";
    setUpdatingOrderId(orderId);

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert("Error updating order status: " + err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        Error: {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        No orders found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Orders List</h1>
      {orders.map((order) => {
        const orderDate = order.createdAt
          ? new Date(order.createdAt)
          : getTimestampFromObjectId(order._id);

        const isUpdating = updatingOrderId === order._id;

        return (
          <div
            key={order._id}
            className="p-6 border rounded-lg shadow-sm bg-white"
          >
            <p className="font-mono text-xs text-gray-500 mb-1">
              Order ID: {order._id}
            </p>
            <p className="text-green-700 font-semibold mb-1">
              Status: {order.status || "placed"}
            </p>
            <p className="mb-1">
              User: {order.userDetails?.name || "Unknown"} (Table:{" "}
              {order.userDetails?.tableNumber || "N/A"})
            </p>
            <p className="mb-1">
              Payment Method: {order.paymentMethod || "Unknown"}
            </p>
            <p className="mb-4 font-semibold text-lg">
              Total Price: ₹{order.totalPrice?.toFixed(2) || "0.00"}
            </p>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Items:</h3>
              <ul className="list-disc list-inside max-h-40 overflow-auto text-gray-700">
                {(order.items || []).map(({ id, name, quantity, price }) => (
                  <li key={id || name}>
                    {name} x {quantity} - ₹{(price * quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Ordered on: {orderDate.toLocaleString()}
            </p>

            <button
              onClick={() => toggleOrderStatus(order._id, order.status || "placed")}
              disabled={isUpdating}
              className={`px-4 py-2 rounded ${
                order.status === "done"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-400 hover:bg-gray-500 text-white"
              } transition disabled:opacity-50`}
            >
              {isUpdating
                ? "Updating..."
                : order.status === "done"
                ? "Mark as Not Done"
                : "Mark as Done"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default OrdersList;
