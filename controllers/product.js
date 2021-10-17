const Product = require("../models/product");
const ProductCategories = require("../models/productCategories");
const { validationResult } = require("express-validator");

// Add new product
exports.addNewProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .send({ error: "true", message: errors.array()[0].msg });
  }

  let category;
  category = await ProductCategories.findOne({name: req.body.category});
  if (category == null) {
    await ProductCategories.create({name: req.body.category})
      .then((value) => {
        category = value;
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).send({ error: 'true', message: 'Error occurred' });
      });
  }
  await Product.create({
    productName: req.body.productName,
    category: category._id,
    costPrice: req.body.costPrice,
    sellingPrice: req.body.sellingPrice,
    initialQty: req.body.initialQty,
    currentQty: req.body.currentQty,
    sellersName: req.body.sellersName,
  }).then((value) => {
      return res.status(200).send({error: "false", message: `${req.body.productName} was successfully added`});
  }).catch((err) => {
    console.log(err);
    return res.status(500).send({error: "true", message: "Database operation failed, please try again"});
  });
};

// Fetch all available products
exports.fetchProducts = async (req, res, next) => {
  try {
    let page
    if(req.query.page == null) page = 1
    else page = parseInt(req.query.page)

    let limit
    if(req.query.limit == null) limit = 15
    else limit = parseInt(req.query.limit)
    
    const skipIndex = (page - 1) * limit

    const products = await Product.find().populate("category").sort({ createdAt: -1 }).limit(limit).skip(skipIndex).exec()
    return res.status(200).send({error: false, message: "Successfully fetched all products", data: products })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: true, message: "Database operation failed" })
  }
};

// Fetch a particular product
exports.findProduct = (req, res, next) => {
  Product.findById(req.params.id).populate("category")
    .then((product) => {  
      if (!product) {
        return res.status(422).send({error: "true", message: "Couldn't find the product with the id specified"});
      }
      return res.status(200).send({error: "false", message: "Product successfully fetched", data: product });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ error: "true", message: `Unable to fetch product` });
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
        return res.status(422).send({error: "true", message: "Couldn't find the product with the id specified" });
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
            sellersName: req.body.sellersName,
          },
        },
        function (err, result) {
          if (err) {
            console.log(err);
            return resizeBy.status(500).send({ error: "true", message: "Updating product failed." });
          } else {
            return res.status(200).send({error: "false", message: `Updated ${req.body.productName} successfully` });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({error: "true", message: `Database operation failed, please try again` });
    });
};

// Delete product
exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.id;
  const productName = req.body.productName;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.status(422).send({error: "true", message: "Couldn't find the product with the id specified" });
      }
      if (product.productName !== productName) {
        return res.status(422).send({error: "true", message: "Product name doesn't match with the product id" });
      }
      return Product.deleteOne({ _id: prodId });
    })
    .then(() => {
      return res.status(200).send({ error: "false", message: `Deleted ${productName} successfully` });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ error: "true", message: "Deleting product failed." });
    });
};
