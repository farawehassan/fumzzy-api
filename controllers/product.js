const Product = require("../models/product");
const { validationResult } = require("express-validator");

// Add new product
exports.addNewProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .send({ error: "true", message: errors.array()[0].msg });
  }

  const product = new Product({
    productName: req.body.productName,
    category: req.body.category,
    costPrice: req.body.costPrice,
    sellingPrice: req.body.sellingPrice,
    initialQty: req.body.initialQty,
    currentQty: req.body.currentQty,
    sellersName: req.body.sellersName,
  });
  product
    .save()
    .then((value) => {
      return res
        .status(200)
        .send({
          error: "false",
          message: `${req.body.productName} was successfully added`,
        });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send({
          error: "true",
          message: "Database operation failed, please try again",
        });
    });
};

// Fetch all available products
exports.fetchProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .select(["-__v"])
      .populate("category")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      error: false,
      message: "Successfully fetched all products",
      data: products,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ error: true, message: "Database operation failed" });
  }
};

// Fetch a particular product
exports.findProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        return res
          .status(422)
          .send({
            error: "true",
            message: "Couldn't find the product with the id specified",
          });
      }
      return res
        .status(200)
        .send({
          error: "false",
          message: "Product successfully fetched",
          data: product,
        });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send({ error: "true", message: `Unable to fetch product` });
    });
};

// Modify product to change the name, cp, sp or
// add another quantity if another quantity of the same product is added
exports.updateProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .send({ status: 422, error: "true", message: errors.array()[0].msg });
  }

  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        return res
          .status(422)
          .send({
            error: "true",
            message: "Couldn't find the product with the id specified",
          });
      }
      Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            productName: req.body.productName,
            category: req.body.category,
            costPrice: req.body.costPrice,
            sellingPrice: req.body.sellingPrice,
            initialQty: req.body.initialQty,
            currentQty: req.body.currentQty,
            sellersName: eq.body.sellersName,
          },
        },
        function (err, result) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .send({ error: "true", message: "Updating product failed." });
          } else {
            return res
              .status(200)
              .send({
                error: "false",
                message: `Updated ${req.body.productName} successfully`,
              });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send({
          error: "true",
          message: `Database operation failed, please try again`,
        });
    });
};

// Delete product
exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.id;
  const productName = req.body.productName;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res
          .status(422)
          .send({
            error: "true",
            message: "Couldn't find the product with the id specified",
          });
      }
      if (product.productName !== productName) {
        return res
          .status(422)
          .send({
            error: "true",
            message: "Product name doesn't match with the product id",
          });
      }
      return Product.deleteOne({ _id: prodId });
    })
    .then(() => {
      return res
        .status(200)
        .send({
          error: "false",
          message: `Deleted ${productName} successfully`,
        });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send({ error: "true", message: "Deleting product failed." });
    });
};
