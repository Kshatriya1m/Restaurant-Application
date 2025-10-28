import React from "react";

const GST_RATE = 0.18; // 18% GST

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);

const OrderSummary = ({ items = [] }) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const gst = subtotal * GST_RATE;
  const total = subtotal + gst;

  if (items.length === 0) {
    return (
      <div className="border p-4 rounded shadow max-w-md mt-6 text-center text-gray-600">
        No items in the order.
      </div>
    );
  }

  return (
    <div className="border p-4 rounded shadow max-w-md mt-6">
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
      <ul className="mb-4">
        {items.map((item) => (
          <li
            key={item.id || item._id}
            className="flex justify-between mb-2 border-b pb-1"
          >
            <span>
              {item.title} x {item.quantity}
            </span>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <hr className="mb-2" />
      <div className="flex justify-between mb-1">
        <span>Subtotal:</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span>GST (18%):</span>
        <span>{formatCurrency(gst)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Total:</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
