const Expenses = require('../models/expenses')
const { validationResult } = require('express-validator')

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
          message: 'Successfully added expenses',
          data: expenses,
        })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send({ error: true, message: 'Error occurred' })
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
    let page
    if(req.query.page == null) page = 1
    else page = parseInt(req.query.page)

    let limit
    if(req.query.limit == null) limit = 15
    else limit = parseInt(req.query.limit)
    
    const skipIndex = (page - 1) * limit

    let expenses;
    if(req.query.searchWord == null){
      expenses = await Expenses.find().select(['-__v']).populate('staff', '-pin -__v').sort({ createdAt: -1 }).limit(limit).skip(skipIndex).exec()
    } 
    else {
      expenses = await Expenses.find({ 'description' : {$regex : req.query.searchWord, $options : 'i'} }).populate('staff', '-pin -__v').sort({ createdAt: -1 }).limit(limit).skip(skipIndex).exec()
    } 
    const expensesLength = await Expenses.estimatedDocumentCount();
    const result = {
      totalCount: expensesLength,
      page: page,
      count: limit,
      items: expenses
    }
    return res.status(200).send({error: false, message: 'Successfully fetched creditors', data: result })
  } catch (error) {
    console.log(err)
    return res.status(500).send({ error: true, message: 'Database operation failed, please try again' })
  }
}
