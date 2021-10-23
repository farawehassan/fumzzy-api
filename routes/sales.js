const path = require('path')
const express = require('express')
const salesController = require('../controllers/sales')
const isAuth = require('../middleware/is-auth')
const router = express.Router()

// Fetch all sales from the database
router.get('/fetchAll', isAuth, salesController.fetchSales)
 
// Add new sale to the database
router.post('/addNew', isAuth, salesController.addNewSales)

// Update sales product name 
router.put('/updateSalesName', isAuth, salesController.updateSalesReportName)

// Delete a sales from the database 
router.delete('/delete', isAuth, salesController.deleteSales)

module.exports = router
 