const mongoose = require('mongoose')

const Schema = mongoose.Schema

const purchasesSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Purchases', purchasesSchema)
