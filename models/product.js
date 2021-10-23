const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategories',
    },
    costPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    initialQty: {
      type: Number,
      required: true,
    },
    currentQty: {
      type: Number,
      required: true,
    },
    sellersName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Products', productSchema)
