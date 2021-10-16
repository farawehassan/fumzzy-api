const mongoose = require("mongoose");

const productCategoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us the category name!"],
    },
    products: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ProductCategories = mongoose.model(
  "ProductCategories",
  productCategoriesSchema
);

module.exports = ProductCategories;
