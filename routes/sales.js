const path = require('path')
const express = require('express')
const salesController = require('../controllers/sales')
const isAuth = require('../middleware/is-Auth')
const router = express.Router()

// Fetch all sales from the database
router.get('/fetchAllSales', isAuth, salesController.fetchSales)
 
// Add new sale to the database
router.post('/addNewSales', isAuth, salesController.addNewSales)

// Update sales product name 
router.put('/updateSalesName', isAuth, salesController.updateSalesReportName)

// Delete a sales from the database 
router.delete('/deleteSales', isAuth, salesController.deleteSales)

module.exports = router
 