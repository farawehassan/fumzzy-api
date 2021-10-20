const Expenses = require("../models/expenses")
const { validationResult } = require("express-validator")

/// This function creates a new expenses the staff makes 
exports.create = async (req, res, next) => {
  const description = req.body.description
  const amount = req.body.amount
  const staff = req.userId

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .send({ error: true, message: errors.array()[0].msg })
  }

  await Expenses.create({
    description: description,
    amount: amount,
    staff: staff,
  })
    .then((expenses) => {
      return res
        .status(201)
        .send({
          error: false,
          message: "Successfully added expenses",
          data: expenses,
        })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send({ error: true, message: "Error occurred" })
    })
}

/// This function deletes expenses the expenses table 
exports.delete = async (req, res, next) => {
  const expensesId = req.params.id

  await Expenses.deleteOne({ _id: expensesId }
  ).then((expenses) => {
    return res.status(200).send({ error: false, message: 'Successfully deleted expenses' })
  }).catch((err) => {
    return res.status(404).send({ error: true, message: 'Expenses not found' })
  })
}

/// This function gets all the expenses in the Expenses table
exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expenses.find()
      .select(["-__v"])
      .populate('staff', "-pin -__v")
      .sort({ createdAt: -1 })
    return res
      .status(200)
      .send({
        error: false,
        message: "Successfully fetched all expenses",
        data: expenses,
      })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .send({ error: true, message: "Database operation failed" })
  }
}
