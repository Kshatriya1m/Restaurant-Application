const Order = require("../models/Order");

// POST place an order
exports.placeOrder = async (req, res, next) => {
  try {
    const { userDetails, items, totalPrice, paymentMethod, status } = req.body;

    // Validation
    if (
      !userDetails?.name ||
      !userDetails?.tableNumber ||
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof totalPrice !== "number" ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required order data" });
    }

    for (const item of items) {
      if (!item.id || !item.name || item.price == null || item.quantity == null) {
        return res.status(400).json({ message: "Invalid item data" });
      }
    }

    const newOrder = new Order({
      userDetails,
      items,
      totalPrice,
      paymentMethod,
      status: status || "placed",
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    next(err);
  }
};

// GET all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
