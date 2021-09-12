const mongoose = require('mongoose');

const expensesSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please tell us the description!'],
  },
  amount: {
    type: Number,
    required: [true, 'Please tell us the amount!'],
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true }
);

const Expenses = mongoose.model('Expenses', expensesSchema);

module.exports = Expenses;