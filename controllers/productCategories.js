const ProductCategories = require("../models/productCategories")
const { validationResult } = require("express-validator")

/// This function creates a new category
exports.create = async (req, res, next) => {
  const name = req.body.name

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .send({ error: true, message: errors.array()[0].msg })
  }

  const category = await ProductCategories.findOne({ name: name })
  if (category)
    return res
      .status(401)
      .send({ error: true, message: "Category exists already" })

  await ProductCategories.create({
    name: name,
  })
    .then((category) => {
      return res.status(201).send({
        error: false,
        message: "Successfully added category",
        data: category,
      })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send({ error: true, message: "Error occurred" })
    })
}

/// This function edits a category name
exports.edit = async (req, res, next) => {
  const categoryId = req.body.id
  const name = req.body.name

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .send({ error: true, message: errors.array()[0].msg })
  }

  await ProductCategories.findByIdAndUpdate(categoryId, {
    $set: { name: name },
  })
    .then((value) => {
      return res
        .status(200)
        .send({ error: false, message: `Successfully updated category name` })
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ error: true, message: `Database operation failed` })
    })
}

/// This function deletes a category
exports.delete = async (req, res, next) => {
  const categoryId = req.params.id

  const category = await ProductCategories.findById(categoryId)
  if (!category)
    return res
      .status(404)
      .send({ error: true, message: "Product category not found" })
  if (category.products == 0) {
    await ProductCategories.findByIdAndDelete(categoryId)
      .then((value) => {
        return res
          .status(200)
          .send({ error: false, message: "Successfully deleted category" })
      })
      .catch((err) => {
        return res
          .status(404)
          .send({ error: true, message: "Product category not found" })
      })
  }
}

/// This function gets all the categories in the Categories table
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await ProductCategories.find()
      .select(["-__v"])
      .sort({ createdAt: -1 })
    return res.status(200).send({
      error: false,
      message: "Successfully fetched all categories",
      data: categories,
    })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .send({ error: true, message: "Database operation failed" })
  }
}
