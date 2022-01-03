const express = require('express')
const { body } = require('express-validator')
const controller = require('../controllers/product')
const isAuth = require('../middleware/is-auth')
const router = express.Router()

// Fetch all available products from the database - paginated
router.get('/fetchAll', isAuth, controller.fetchProducts)

// Fetch all available products from the database
router.get('/fetchAllProducts', isAuth, controller.fetchAllProducts)

// Fetch a particular product from the database
router.get('/fetch/:id', isAuth, controller.findProduct)

// Add new product to the database
router.post(
  '/add',
  isAuth,
  [
    body('costPrice')
      .trim()
      .custom((value, { req }) => {
        if (parseFloat(value) > parseFloat(req.body.sellingPrice)) {
          throw new Error('Cost price cannot be greater than selling price')
        }
        return true
      }),
    body('sellingPrice')
      .trim()
      .custom((value, { req }) => {
        if (parseFloat(value) < parseFloat(req.body.costPrice)) {
          throw new Error('Selling price cannot be lesser than the cost price')
        }
        return true
      }),
  ],
  controller.addNewProduct
)

// Update a product's details in the database
router.put(
  '/update/:id',
  isAuth,
  [
    body('costPrice')
      .trim()
      .custom((value, { req }) => {
        if (parseFloat(value) > parseFloat(req.body.sellingPrice)) {
          throw new Error('Cost price cannot be greater than selling price')
        }
        return true
      }),
    body('sellingPrice')
      .trim()
      .custom((value, { req }) => {
        if (parseFloat(value) < parseFloat(req.body.costPrice)) {
          throw new Error('Selling price cannot be lesser than the cost price')
        }
        return true
      }),
  ],
  controller.updateProduct
)

// Delete a product from the database
router.delete('/delete', isAuth, controller.deleteProduct)


router.put('/testUpdate', isAuth, controller.updateTest)

module.exports = router
