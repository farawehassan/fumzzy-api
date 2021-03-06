const mongoose = require('mongoose')

const Schema = mongoose.Schema

const customerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  reports: [
    { 
      report: { type: Schema.Types.Mixed, required: true },
      discount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
      paymentMade: { type: Number, required: true },
      paid: { type: Boolean, required: true },
      soldAt: { type: Date, required: true },
      dueDate: Date,
      paymentReceivedAt: Date,
      description: String
    }
  ],
}, { timestamps: true }
)

module.exports = mongoose.model('Customer', customerSchema)