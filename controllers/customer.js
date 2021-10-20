const Customer = require('../models/customer')
const { validationResult } = require('express-validator')

// Add new customer
exports.addNewCustomer = async (req, res, next) => {
  const name = req.body.name

  const report = req.body.report
  const totalAmount = req.body.totalAmount
  const paymentMade = req.body.paymentMade
  const paid = req.body.paid
  const soldAt = req.body.soldAt
  var dueDate
  var paymentReceivedAt

  var reports

  if (req.body.dueDate) {
    dueDate = req.body.dueDate
    reports = {
      report: report,
      totalAmount: totalAmount,
      paymentMade: paymentMade,
      paid: paid,
      soldAt: soldAt,
      dueDate: dueDate,
    }
  }
  else if (req.body.paymentReceivedAt) {
    paymentReceivedAt = req.body.paymentReceivedAt
    reports = {
      report: report,
      totalAmount: totalAmount,
      paymentMade: paymentMade,
      paid: paid,
      soldAt: soldAt,
      paymentReceivedAt: paymentReceivedAt,
    }
  }

  const newReports = [reports]

await Customer.create({
    name: name,
    reports: newReports
  }).then(result => {
      return res.status(200).send({ error: false, message: `Customer was successfully added`, data: result })
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({ error: true, message: "Database operation failed, please try again" })
    })
}

// Fetch all customers
exports.fetchCustomers = async (req, res, next) => {
  try {
    let page
    if(req.query.page == null) page = 1
    else page = parseInt(req.query.page)

    let limit
    if(req.query.limit == null) limit = 15
    else limit = parseInt(req.query.limit)
    
    const skipIndex = (page - 1) * limit

    const customers = await Customer.find().sort({ createdAt: -1 }).limit(limit).skip(skipIndex).exec()
    const customersLength = await Customer.estimatedDocumentCount();
    const result = {
      totalCount: customersLength,
      page: page,
      count: limit,
      items: customers
    }
    return res.status(200).send({error: false, message: "Successfully fetched customers", data: result })
  } catch (error) {
    console.log(err)
    return res.status(500).send({ error: true, message: "Database operation failed, please try again" })
  }

}

// Fetch a particular customer
exports.findCustomer = (req, res, next) => {
  Customer.findById(req.params.id)
    .then(customer => {
      if (!customer) {
        return res.status(422).send({ error: true, message: "Couldn't find the customer with the id specified" })
      }
      return res.status(200).send({ error: false, message: "Customer successfully fetched", data: customer })
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({ error: true, message: `Unable to fetch customer` })
    })
}

// Add new customer report / sales
exports.addNewCustomerReport = (req, res, next) => {
  const customerId = req.body.id

  const report = req.body.report
  const totalAmount = req.body.totalAmount
  const paymentMade = req.body.paymentMade
  const paid = req.body.paid
  const soldAt = req.body.soldAt
  var dueDate
  var paymentReceivedAt

  var reports

  if (req.body.dueDate) {
    dueDate = req.body.dueDate
    reports = {
      report: report,
      totalAmount: totalAmount,
      paymentMade: paymentMade,
      paid: paid,
      soldAt: soldAt,
      dueDate: dueDate,
    }
  }
  else if (req.body.paymentReceivedAt) {
    paymentReceivedAt = req.body.paymentReceivedAt
    reports = {
      report: report,
      totalAmount: totalAmount,
      paymentMade: paymentMade,
      paid: paid,
      soldAt: soldAt,
      paymentReceivedAt: paymentReceivedAt,
    }
  }

  const newReports = [reports]

  Customer.findById(customerId)
    .then(customer => {
      if (!customer) {
        return res.status(422).send({ error: true, message: "Couldn't find the customer with the id specified" })
      }
      Customer.findByIdAndUpdate(customerId, { $push: { reports: newReports } },
        function (err, result) {
          if (err) {
            console.log(err)
            return res.status(500).send({ error: true, message: "Adding reports to customer failed." })
          } else {
            return res.status(200).send({ error: false, message: `Reports updated successfully for ${customer.name}` })
          }
        }
      )
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({ error: true, message: `Unable to fetch customer` })
    })
}

// Update a particular report details of a customer
exports.updateCustomerReport = (req, res, next) => {
  const customerId = req.body.id
  const reportId = req.body.reportId
  const report = req.body.report
  const totalAmount = req.body.totalAmount
  const paymentMade = req.body.paymentMade

  Customer.findById(customerId)
    .then(customer => {
      if (!customer) {
        return res.status(422).send({ error: true, message: "Couldn't find the customer with the id specified" })
      }
      Customer.findOneAndUpdate({ 'reports._id': reportId }, {
        $set: {
          'reports.$.report': report,
          'reports.$.totalAmount': totalAmount,
          'reports.$.paymentMade': paymentMade
        }
      },
        function (err, result) {
          if (err) {
            console.log(err)
            return res.status(500).send({ error: true, message: "Updating payment to report failed." })
          } else {
            return res.status(200).send({ error: false, message: `Report updated successfully for ${customer.name}` })
          }
        }
      )
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({ error: true, message: `Unable to fetch customer` })
    })
}

// Update a particular report payment made of a customer
exports.updatePaymentMadeReport = (req, res, next) => {
  const customerId = req.body.id
  const reportId = req.body.reportId
  const payment = req.body.payment

  Customer.findById(customerId)
    .then(customer => {
      if (!customer) {
        return res.status(422).send({ error: true, message: "Couldn't find the customer with the id specified" })
      }
      Customer.findOneAndUpdate({ 'reports._id': reportId }, { $set: { 'reports.$.paymentMade': payment } },
        function (err, result) {
          if (err) {
            console.log(err)
            return res.status(500).send({ error: true, message: "Updating payment to report failed." })
          } else {
            return res.status(200).send({ error: false, message: `Payment updated successfully for ${customer.name}` })
          }
        }
      )
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({ error: true, message: `Unable to fetch customer` })
    })
}

// Settle a particular report payment made of a customer
exports.settlePaymentReport = (req, res, next) => {
  const customerId = req.body.id
  const reportId = req.body.reportId
  const payment = req.body.payment
  const paymentReceivedAt = req.body.paymentReceivedAt

  Customer.findById(customerId)
    .then(customer => {
      if (!customer) {
        return res.status(422).send({ error: true, message: "Couldn't find the customer with the id specified" })
      }
      Customer.findOneAndUpdate({ 'reports._id': reportId }, {
        $set: {
          'reports.$.paymentMade': payment,
          'reports.$.paid': true,
          'reports.$.paymentReceivedAt': paymentReceivedAt
        }
      },
        function (err, result) {
          if (err) {
            console.log(err)
            return res.status(500).send({ error: true, message: "Updating payment to report failed." })
          } else {
            return res.status(200).send({ error: false, message: `Payment settled successfully for ${customer.name}` })
          }
        }
      )
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({ error: true, message: `Unable to fetch customer` })
    })
}

// Delete a customer 
exports.deleteCustomer = (req, res, next) => {
  const customerId = req.params.id

  Customer.findById(customerId)
    .then(customer => {
      if (!customer) {
        return res.status(422).send({ error: true, message: "Couldn't find the customer with the id specified" })
      }
      return Customer.deleteOne({ _id: customerId })
    })
    .then(() => {
      return res.status(200).send({ error: false, message: `Deleted customer successfully` })
    })
    .catch(err => {
      return res.status(500).send({ error: true, message: "Deleting customer failed." })
    })
}

// Delete a customer's reports
exports.removeCustomerReport = (req, res, next) => {
  const customerId = req.body.customerId
  const reportId = req.body.reportId

  Customer.updateOne({ _id: customerId }, { "$pull": { "reports": { "_id": reportId } } },
   { safe: true, multi: true }, function (err, obj) {
    if (err) {
      console.log(err)
      return res.status(500).send({ error: true, message: "Deleting customer sales failed." })
    } else {
      return res.status(200).send({ error: false, message: `Deleted successfully` })
    }
  })
}