const express = require("express");
const controller = require("../controllers/productHistory");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

// Fetch all product history from the database
router.get("/fetchProductHistory", isAuth, controller.fetchProductHistory);

// Fetch a particular product history from the database
router.get("/findProductHistory/:id", isAuth, controller.findProductHistory);

// Add new product history to the database
router.post("/addProductHistory", isAuth, controller.addProductHistory);

// Add new history to product history to the database
router.post(
  "/addNewProductToHistory",
  isAuth,
  controller.addNewProductToHistory
);

// Update product history name in the database
router.put("/updateProductName", isAuth, controller.updateProductName);

// Delete a product history
router.delete("/deleteHistory/:id", isAuth, controller.deleteHistory);

module.exports = router;
