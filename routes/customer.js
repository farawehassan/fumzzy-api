const express = require('express')
const customerController = require('../controllers/customer')
const isAuth = require('../middleware/is-auth')
const router = express.Router()

// Fetch all customers from the database
router.get('/fetchAll', isAuth, customerController.fetchCustomers)

// Fetch a particular customer from the database
router.get('/fetchCustomer/:id', isAuth, customerController.findCustomer)

// Add new customer reports to the database
router.post('/addNew', isAuth, customerController.addNewCustomer)

// Add previous customer details to the database
router.post('/addPrevious', isAuth, customerController.addPreviousCustomer)

// Add new reports of customer to the database
router.post('/addNewCustomerReports', isAuth, customerController.addNewCustomerReport)

// Add new reports of previous customer details to the database
router.post('/addNewPreviousCustomerReports', isAuth, customerController.addNewPreviousCustomerReport)

// Update a particular report details of a customer
router.put('/updateCustomerReport', isAuth, customerController.updateCustomerReport)

// Update a particular report payment made of a customer
router.put('/updatePaymentMadeReport', isAuth, customerController.updatePaymentMadeReport)

// Settle a particular report payment made of a customer
router.put('/settlePaymentReport', isAuth, customerController.settlePaymentReport)

// Delete a customer's report
router.put('/removeCustomerReport', isAuth, customerController.removeCustomerReport) 
 
// Delete a customer 
router.delete('/delete/:id', isAuth, customerController.deleteCustomer) 
 
module.exports = router