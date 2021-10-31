const Creditors = require('../models/creditor')
const { validationResult } = require('express-validator')

/// This function creates a new creditors the staff makes 
exports.create = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(422).send({ error: true, message: errors.array()[0].msg })

  const reports = [{
      amount: req.body.amount,
      paymentMade: req.body.paymentMade,
      description: req.body.description
  }]

  await Creditors.create({
    name: req.body.name,
    reports: reports
  })
    .then((creditors) => {
      return res.status(201).send({ error: false, message: 'Successfully added creditors', data: creditors })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send({ error: true, message: 'Error occurred' })
    })
}

/// This function adds more reports/credits to a creditor
exports.addCreditToCreditor = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(422).send({ error: true, message: errors.array()[0].msg })
  
  const newReports = [{
      amount: req.body.amount,
      paymentMade: req.body.paymentMade,
      description: req.body.description
  }]

  Creditors.findById(req.body.creditorId)
    .then(creditor => {
      if (!creditor) return res.status(422).send({ error: true, message: 'Couldn\'t find the creditor with the id specified' })
      Creditors.findByIdAndUpdate(req.body.creditorId, { $push: { reports: newReports } },
        function (err, result) {
          if(err) {
            console.log(err)
            return res.status(500).send({ error: true, message: 'Adding credits to creditor failed.' })
          } 
          else return res.status(200).send({ error: false, message: 'Reports updated successfully' }) 
        }
      )
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({ error: true, message: `Unable to fetch creditor` })
    })
}

/// This function updates creditors details
exports.updateCreditor = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(422).send({ error: true, message: errors.array()[0].msg })
  
  Creditors.findById(req.body.creditorId)
    .then(creditor => {
      if (!creditor) return res.status(422).send({ error: true, message: 'Couldn\'t find the customer with the id specified' })
    
      Creditors.findOneAndUpdate({ 'reports._id': req.body.reportId }, {
        $set: {
          'reports.$.amount': req.body.amount,
          'reports.$.paymentMade': req.body.paymentMade,
          'reports.$.description': req.body.description,
        }
      },
        function (err, result) {
          if(err) {
            console.log(err)
            return res.status(500).send({ error: true, message: 'Updating payment to report failed.' })
          } 
          else return res.status(200).send({ error: false, message: 'Report updated successfully' })
        }
      )
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({ error: true, message: `Unable to fetch creditor` })
    })
}

/// This function gets all the creditors in the Creditors table
exports.getCreditors = async (req, res, next) => {
  try {
    const creditors = await Creditors.find().select(['-__v']).sort({ updatedAt: -1 })
    return res.status(200).send({error: false, message: 'Successfully fetched all creditors', data: creditors})
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: true, message: 'Database operation failed' })
  }
}

/// Fetch all creditors paginated
exports.getPaginatedCreditors = async (req, res, next) => {
  try {
    let page
    if(req.query.page == null) page = 1
    else page = parseInt(req.query.page)

    let limit
    if(req.query.limit == null) limit = 15
    else limit = parseInt(req.query.limit)
    
    const skipIndex = (page - 1) * limit

    const creditors = await Creditors.find().select(['-__v']).sort({ updatedAt: -1 }).limit(limit).skip(skipIndex).exec()
    const creditorsLength = await Creditors.estimatedDocumentCount();
    const result = {
      totalCount: creditorsLength,
      page: page,
      count: limit,
      items: creditors
    }
    return res.status(200).send({error: false, message: 'Successfully fetched creditors', data: result })
  } catch (error) {
    console.log(err)
    return res.status(500).send({ error: true, message: 'Database operation failed, please try again' })
  }

}

// Remove a creditor's reports
exports.removeCredit = (req, res, next) => {
  Creditors.updateOne({ _id: req.body.creditorId }, { '$pull': { 'reports': { '_id': req.body.reportId } } },
   { safe: true, multi: true }, function (err, obj) {
    if (err) {
      console.log(err)
      return res.status(500).send({ error: true, message: 'Deleting credit failed' })
    } 
    else return res.status(200).send({ error: false, message: `Deleted successfully` })
  })
}

/// This function deletes creditors the creditors table 
exports.delete = async (req, res, next) => {
  await Creditors.deleteOne({ _id: req.params.id }
  ).then((creditors) => {
    return res.status(200).send({ error: false, message: 'Successfully deleted creditors' })
  }).catch((err) => {
    return res.status(404).send({ error: true, message: 'Creditors not found' })
  })
}