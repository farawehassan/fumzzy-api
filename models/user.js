const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  phone: {
    type: String,
  },
  type: {
    type: String,
    enum: ['staff', 'admin'],
    required: true
  }, 
  status: {
    type: String,
    enum: ['active', 'block', 'delete'],
    default: 'active'
  },
  pin: {
    type: String,
    required: [true, 'Please provide a pin'],
    length: 4,
  },
}, { timestamps: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User