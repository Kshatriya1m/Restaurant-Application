const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userDetails: {
    name: { type: String, required: true },
    tableNumber: { type: String, required: true },
  },
  items: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "placed" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
