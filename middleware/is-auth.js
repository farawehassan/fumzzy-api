const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    return res.send({
      status: 401,
      error: true,
      message: 'Not authenticated',
    })
  }
  const token = authHeader.split(' ')[1]
  let decodedToken
  try {
    decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`)
  } catch (error) {
    return res.send({
      status: 422,
      error: true,
      message: 'Invalid authorization token',
    })
  }
  if (!decodedToken) {
    return res.send({
      status: 401,
      error: true,
      message: 'Not authenticated',
    })
  }
  const user = await User.findById(decodedToken.userId)
  if (!user)
    return res.status(404).send({
      error: true,
      message: 'The user with the given ID was not found.',
    })

  req.userId = decodedToken.userId
  req.name = decodedToken.name
  next()
}
