const User = require("../models/user")
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

/// This function does the log in process checking if the user exist and pin is valid
/// It returns the user model if successful
exports.login = (req, res, next) => {
  const name = req.body.name
  const pin = req.body.pin
  let loadedUser
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .send({ error: true, message: errors.array()[0].msg })
  }

  User.findOne({ name: name })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ error: true, message: "User does not exist" })
      }
      loadedUser = user
      bcrypt
        .compare(pin, user.pin)
        .then((result) => {
          if (result) {
            const token = jwt.sign(
              {
                name: loadedUser.name,
                userId: loadedUser._id.toString(),
              },
              `${process.env.JWT_SECRET}`
            )
            var details = {
              id: loadedUser._id,
              name: loadedUser.name,
              phone: loadedUser.phone,
              type: loadedUser.type,
              status: loadedUser.status,
              createdAt: loadedUser.createdAt,
              updatedAt: loadedUser.updatedAt,
              token: token,
            }
            return res.status(200).send({
              error: false,
              message: "User logged in successfully",
              data: details,
            })
          } else if (!result) {
            return res
              .status(401)
              .send({ error: true, message: "Incorrect pin" })
          }
        })
        .catch((err) => {
          console.log(err)
          return res.status(500).send({
            error: true,
            message: "Database operation failed, please try again",
          })
        })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send({
        error: true,
        message: "Database operation failed, please try again",
      })
    })
}

/// This function does the sign up process by saving the user's details in the
/// request body to the user model after validated and does not exist before
exports.signup = (req, res, next) => {
  const name = req.body.name
  const phone = req.body.phone
  const type = req.body.type
  const pin = req.body.pin

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .send({ error: true, message: errors.array()[0].msg })
  }

  User.findOne({ phone: phone })
    .then((userDoc) => {
      if (userDoc) {
        return res.status(422).send({
          error: true,
          message: "User already exist, please pick a different phone number",
        })
      }
      return bcrypt
        .hash(pin, 12)
        .then((hashedPin) => {
          const user = new User({
            name: name,
            phone: phone,
            type: type,
            pin: hashedPin,
          })
          return user.save()
        })
        .then((result) => {
          return res
            .status(201)
            .send({ error: false, message: "User created successfully" })
        })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send({
        error: true,
        message: "Database operation failed, please try again",
      })
    })
}

/// This function does the ability to block, unblock and delete user by changing
/// the status of a user
exports.staffAction = async (req, res, next) => {
  const status = req.params.status
  const userId = req.params.id
  let response
  if (status === "active") {
    response = "activated"
  } else if (status === "block") {
    response = "blocked"
  } else if (status === "delete") {
    response = "deleted"
  } else {
    return res
      .status(422)
      .send({ error: true, message: "Invalid status action" })
  }
  await User.findByIdAndUpdate(userId, { $set: { status: status } })
    .then((updatedUser) => {
      return res
        .status(200)
        .send({ error: false, message: `Successfully ${response} user` })
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ error: true, message: `Database operation failed` })
    })
}

/// This function edit name and phone number of a user
exports.editUser = async (req, res, next) => {
  const name = req.body.name
  const phone = req.body.phone

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .send({ error: true, message: errors.array()[0].msg })
  }

  await User.findByIdAndUpdate(req.userId, {
    $set: { name: name, phone: phone },
  })
    .then((updatedUser) => {
      return res
        .status(200)
        .send({ error: false, message: `Successfully updated user` })
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ error: true, message: `Database operation failed` })
    })
}

/// This function changes pin of a user
exports.changePin = async (req, res) => {
  const currentPin = req.body.currentPin
  const newPin = req.body.newPin

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .send({ error: true, message: errors.array()[0].msg })
  }

  const user = await User.findById(req.userId)
  const validPin = await bcrypt.compare(currentPin, user.pin)

  if (!validPin)
    return res
      .status(400)
      .send({ error: true, message: "Current pin does not match" })
  await bcrypt.hash(newPin, 12).then((hashedPin) => {
    User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          pin: hashedPin,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        return res
          .status(200)
          .send({ error: false, message: "Pin updated successfully" })
      })
      .catch((err) => {
        return res.status(404).send({
          error: true,
          message: "The user with the given ID was not found.",
        })
      })
  })
}

/// This function reset pin of a user
exports.resetPin = async (req, res) => {
  const userId = req.params.id
  const newPin = "1234"

  await bcrypt.hash(newPin, 12).then((hashedPin) => {
    User.findByIdAndUpdate(
      userId,
      {
        $set: {
          pin: hashedPin,
        },
      },
      { new: true }
    )
      .then((updatedUser) => {
        return res
          .status(200)
          .send({ error: false, message: "Pin reset successful" })
      })
      .catch((err) => {
        return res.status(404).send({
          error: true,
          message: "The user with the given ID was not found.",
        })
      })
  })
}

/// This function gets all the users in the User table
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select(["-pin", "-__v"])
      .sort({ createdAt: -1 })
    return res.status(200).send({
      error: false,
      message: "Successfully fetched all users",
      data: users,
    })
  } catch (error) {
    return res
      .status(500)
      .send({ error: true, message: "Database operation failed" })
  }
}
