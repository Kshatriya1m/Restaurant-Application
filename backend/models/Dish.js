const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
});

module.exports = mongoose.model("Dish", dishSchema);
