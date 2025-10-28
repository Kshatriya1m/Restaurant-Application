const Dish = require("../models/Dish");

// GET all dishes
exports.getAllDishes = async (req, res, next) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (err) {
    next(err);
  }
};

// GET dishes by category
exports.getDishesByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;
    const dishes = await Dish.find({ category });
    res.json(dishes);
  } catch (err) {
    next(err);
  }
};

// CREATE a dish
exports.createDish = async (req, res, next) => {
  try {
    const newDish = new Dish(req.body);
    const savedDish = await newDish.save();
    res.status(201).json(savedDish);
  } catch (err) {
    next(err);
  }
};

// UPDATE a dish
exports.updateDish = async (req, res, next) => {
  try {
    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDish);
  } catch (err) {
    next(err);
  }
};

// DELETE a dish
exports.deleteDish = async (req, res, next) => {
  try {
    await Dish.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
