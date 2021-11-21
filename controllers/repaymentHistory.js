const RepaymentHistory = require('../models/repaymentHistory')
const { validationResult } = require('express-validator')

// Fetch all repayment history
exports.fetchRepaymentHistory = async (req, res, next) => {
    try {
      const history = await RepaymentHistory.find({customer: req.params.customer, reportId: req.params.reportId}).select(['-__v']).sort({ createdAt: -1 })
      return res.status(200).send({error: false, message: 'Successfully fetched history', data: history })
    } catch (error) {
      console.log(error)
      return res.status(500).send({ error: true, message: 'Database operation failed' })
    }
  }