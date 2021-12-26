const mongoose = require('mongoose')

const Schema = mongoose.Schema

const repaymentHistorySchema = new Schema(
  {
    customer: {
      type: String,
      required: true,
    },
    reportId: {
      type: String,
      required: true,
    },
    paymentMode: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['customer', 'creditor'],
      default: 'customer'
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('RepaymentHistory', repaymentHistorySchema)
