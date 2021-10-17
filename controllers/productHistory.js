const ProductHistory = require("../models/productHistory");

// Add new product history to database
exports.addProductHistory = (req, res, next) => {
  const productHistory = {
    initialQty: req.body.initialQty,
    qtyReceived: req.body.qtyReceived,
    currentQty: req.body.currentQty,
    collectedAt: req.body.collectedAt,
    sellersName: req.body.sellersName,
  };

  const newProductHistory = [productHistory];

  const product = new ProductHistory({
    productName: req.body.productName,
    products: newProductHistory,
  });

  product
    .save()
    .then((savedProduct) => {
      return res
        .status(200)
        .send({
          error: "false",
          message: `${req.body.productName} was saved to history successfully`,
        });
    })
    .catch((err) => {
      return res
        .status(500)
        .send({
          error: "true",
          message: "Database operation failed, please try again",
        });
    });
};

// Fetch all product history
exports.fetchProductHistory = async (req, res, next) => {
  try {
    const products = await ProductHistory.find();
    return res
      .status(200)
      .send({
        error: "false",
        message: "Product history successfully fetched",
        data: products,
      });
  } catch (error) {
    console.log(err);
    return res
      .status(500)
      .send({
        error: "true",
        message: "Database operation failed, please try again",
      });
  }
};

// Fetch a particular product history
exports.findProductHistory = (req, res, next) => {
  ProductHistory.findById(req.params.id)
    .then((product) => {
      if (!product) {
        return res
          .status(422)
          .send({
            error: "true",
            message: "Couldn't find the product history with the id specified",
          });
      }
      return res
        .status(200)
        .send({
          error: "false",
          message: "Product history successfully fetched",
          data: product,
        });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send({ error: "true", message: "Unable to fetch product history" });
    });
};

// Add new history to product history
exports.addNewProductToHistory = (req, res, next) => {
  const productHistory = {
    initialQty: req.body.initialQty,
    qtyReceived: req.body.qtyReceived,
    currentQty: req.body.currentQty,
    collectedAt: req.body.collectedAt,
    sellersName: req.body.sellersName,
  };

  const newHistory = [productHistory];

  ProductHistory.findById(req.body.id)
    .then((product) => {
      if (!product) {
        return res
          .status(422)
          .send({
            error: "true",
            message: "Couldn't find the product with the id specified",
          });
      }
      ProductHistory.findByIdAndUpdate(
        req.body.id,
        { $push: { products: newHistory } },
        function (err, result) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .send({
                error: "true",
                message: "Adding history to product failed.",
              });
          } else {
            return res
              .status(200)
              .send({
                error: "false",
                message: `History updated successfully`,
              });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send({ error: "true", message: `Unable to fetch product` });
    });
};

exports.updateProductName = (req, res, next) => {
  ProductHistory.findById(req.body.id)
    .then((product) => {
      if (!product) {
        return res
          .status(422)
          .send({
            error: "true",
            message: "Couldn't find the product with the id specified",
          });
      }
      ProductHistory.findByIdAndUpdate(
        req.body.id,
        { $set: { productName: req.body.name } },
        function (err, result) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .send({
                error: "true",
                message: "Updating product history failed.",
              });
          } else {
            return res
              .status(200)
              .send({
                error: "false",
                message: `Updated to ${req.body.name} successfully`,
              });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send({ error: "true", message: `Unable to update product name` });
    });
};

// Delete a product history
exports.deleteHistory = (req, res, next) => {
  ProductHistory.findById(req.params.id)
    .then((product) => {
      if (!product) {
        return res
          .status(422)
          .send({
            error: "true",
            message: "Couldn't find the product history with the id specified",
          });
      }
      return ProductHistory.deleteOne({ _id: req.params.id });
    })
    .then(() => {
      return res
        .status(200)
        .send({
          error: "false",
          message: `Deleted product history successfully`,
        });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send({ error: "true", message: "Deleting product history failed." });
    });
};