const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menucontroller");

router.get("/", menuController.getAllDishes);
router.get("/category/:category", menuController.getDishesByCategory);
router.post("/", menuController.createDish);
router.put("/:id", menuController.updateDish);
router.delete("/:id", menuController.deleteDish);

module.exports = router;
