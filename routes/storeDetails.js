const express = require('express')
const storeDetailsController = require('../controllers/storeDetails')
const isAuth = require('../middleware/is-auth')
const router = express.Router()

// Fetch the store details from the server
router.get('/fetchDetails', isAuth, storeDetailsController.fetchDetails)

module.exports = router;