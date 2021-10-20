const mongoose = require('mongoose')

const Schema = mongoose.Schema

const salesSchema = new Schema({
  customerName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
  },
}, { timestamps: true }
)

module.exports = mongoose.model('Sales', salesSchema)