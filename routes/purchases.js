const express = require('express')
const { body } = require('express-validator')
const controller = require('../controllers/purchases')
const isAuth = require('../middleware/is-auth')
const router = express.Router()

// Fetch all available purchases from the database - paginated
router.get('/fetchAll', isAuth, controller.fetchPurchases)

// Fetch all available purchases from the database
router.get('/fetchAllPurchases', isAuth, controller.fetchAllPurchases)

// Fetch all available purchases from the database
router.get('/fetchAllPurchasesByProduct/:productId', isAuth, controller.fetchAllPurchasesByProducts)

// Delete a purchase from the database
router.delete('/delete/:purchaseId', isAuth, controller.deletePurchase)

module.exports = router
