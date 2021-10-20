const express = require('express')
const customerController = require('../controllers/customer')
const isAuth = require('../middleware/is-Auth')
const router = express.Router()

// Fetch all customers from the database
router.get('/fetchAllCustomers', isAuth, customerController.fetchCustomers)

// Fetch a particular customer from the database
router.get('/fetchCustomer/:id', isAuth, customerController.findCustomer)

// Add new customer to the database
router.post('/addNewCustomer', isAuth, customerController.addNewCustomer)

// Add new reports of customer to the database
router.post('/addNewCustomerReports', isAuth, customerController.addNewCustomerReport)

// Update a particular report details of a customer
router.put('/updateCustomerReport', isAuth, customerController.updateCustomerReport)

// Update a particular report payment made of a customer
router.put('/updatePaymentMadeReport', isAuth, customerController.updatePaymentMadeReport)

// Settle a particular report payment made of a customer
router.put('/settlePaymentReport', isAuth, customerController.settlePaymentReport)

// Delete a customer's report
router.put('/deleteCustomerReport', isAuth, customerController.removeCustomerReport) 
 
// Delete a customer 
router.delete('/deleteCustomer/:id', isAuth, customerController.deleteCustomer) 
 
module.exports = router