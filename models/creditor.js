const mongoose = require('mongoose')

const creditorsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us the name!'],
  },
  reports: [
    { 
      amount: { type: Number, required: [true, 'Please tell us the amount!']},
      paymentMade: { type: Number, required: true },
      description: { type: String, required: [true, 'Please tell us the description!'] }
    }, {timestamps: true}
  ],
}, { timestamps: true }
)

const Creditors = mongoose.model('Creditors', creditorsSchema)

module.exports = Creditors