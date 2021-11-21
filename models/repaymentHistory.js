const mongoose = require('mongoose')

const Schema = mongoose.Schema

const repaymentHistorySchema = new Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    reportId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('RepaymentHistory', repaymentHistorySchema)
