const express = require("express");
const controller = require("../controllers/productHistory");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

// Fetch all product history from the database
router.get("/fetchAll", isAuth, controller.fetchProductHistory);

// Fetch a particular product history from the database
router.get("/find/:id", isAuth, controller.findProductHistory);

// Add new history to product history to the database
router.post(
  "/addNewProductToHistory",
  isAuth,
  controller.addNewProductToHistory
);

// Update product history name in the database
router.put("/updateProductName", isAuth, controller.updateProductName);

// Remove history from a product history in the database
router.put("/remove", isAuth, controller.removeHistoryFromProductHistory);

// Delete a product history
router.delete("/delete/:id", isAuth, controller.deleteHistory);

module.exports = router;
