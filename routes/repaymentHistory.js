const express = require('express')
const controller = require('../controllers/repaymentHistory')
const isAuth = require('../middleware/is-auth')
const router = express.Router()

// Fetch repayment history
router.get('/fetch/:customer/:reportId', isAuth, controller.fetchRepaymentHistory)

module.exports = router