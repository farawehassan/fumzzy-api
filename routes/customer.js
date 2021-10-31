const express = require('express')
const controller = require('../controllers/customer')
const isAuth = require('../middleware/is-auth')
const router = express.Router()

// Fetch all customers from the database
router.get('/fetchAll', isAuth, controller.fetchCustomers)

// Fetch all debtors from the database
router.get('/fetchAllDebtors', isAuth, controller.fetchDebtors)

// Fetch all customers name from the database
router.get('/fetchCustomersName', isAuth, controller.fetchCustomersName)

// Fetch a particular customer from the database
router.get('/fetchCustomer/:id', isAuth, controller.findCustomer)

// Add new customer reports to the database
router.post('/addNew', isAuth, controller.addNewCustomer)

// Add previous customer details to the database
router.post('/addPrevious', isAuth, controller.addPreviousCustomer)

// Add new reports of customer to the database
router.post('/addNewCustomerReports', isAuth, controller.addNewCustomerReport)

// Add new reports of previous customer details to the database
router.post('/addNewPreviousCustomerReports', isAuth, controller.addNewPreviousCustomerReport)

// Update a particular report details of a customer
router.put('/updateCustomerReport', isAuth, controller.updateCustomerReport)

// Update a particular report payment made of a customer
router.put('/updatePaymentMadeReport', isAuth, controller.updatePaymentMadeReport)

// Settle a particular report payment made of a customer
router.put('/settlePaymentReport', isAuth, controller.settlePaymentReport)

// Delete a customer's report
router.put('/removeCustomerReport', isAuth, controller.removeCustomerReport) 
 
// Delete a customer 
router.delete('/delete/:id', isAuth, controller.deleteCustomer) 
 
module.exports = router