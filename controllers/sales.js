const Sales = require('../models/sales')
const Product = require('../models/product')

// Fetch all sales - paginated
exports.fetchSales = async (req, res, next) => {
  try {
    let page
    if(req.query.page == null) page = 1
    else page = parseInt(req.query.page)

    let limit
    if(req.query.limit == null) limit = 15
    else limit = parseInt(req.query.limit)
    
    const skipIndex = (page - 1) * limit

    let sales;
    if(req.query.searchWord == null){
      sales = await Sales.find().select(['-__v']).sort({ createdAt: -1 }).limit(limit).skip(skipIndex).exec()
    } 
    else {
      sales = await Sales.find({ 'productName' : {$regex : req.query.searchWord, $options : 'i'} }).select(['-__v']).sort({ createdAt: -1 }).limit(limit).skip(skipIndex).exec()
    }
    const salesLength = await Sales.estimatedDocumentCount();
    const result = {
      totalCount: salesLength,
      page: page,
      count: limit,
      items: sales
    }
    return res.status(200).send({error: false, message: 'Successfully fetched sales', data: result })
  } catch (error) {
    console.log(err)
    return res.status(500).send({ error: true, message: 'Database operation failed, please try again' })
  }
}

// Add new sales and update product's current quantity when an item is sold
exports.addNewSales = async(req, res, next) => {
  const customerName = req.body.customerName
  const quantity = req.body.quantity
  const productName = req.body.productName
  const costPrice = req.body.costPrice
  const unitPrice = req.body.unitPrice
  const totalPrice = req.body.totalPrice
  const paymentMode = req.body.paymentMode

  const product = await Product.findOne({productName: productName})
  if(!product) return res.status(401).send({ error: true, message: 'Product not found' })

  await Sales.create({
    customerName: customerName,
    quantity: quantity,
    productName: productName,
    costPrice: costPrice,
    unitPrice: unitPrice,
    totalPrice: totalPrice,
    paymentMode: paymentMode,
    staff: req.name
  }).then(savedSales => {
    Product.findByIdAndUpdate({ _id: product._id }, { currentQty: (product.currentQty - parseFloat(quantity)) },
      function async (err, result) {
        if (err) {
          console.log(err)
          Sales.findByIdAndDelete(savedSales._id).then( deletedSales => {
            return res.status(500).send({ error: true, message: 'Saving product failed.' })
          }).catch(e => {
            console.log(e)
            return res.status(500).send({ error: true, message: 'Saving product and deleting sales failed.' })
          })
        } 
        else return res.status(200).send({ error: false, message: `${productName} was saved successfully` })
      }
    )
  }).catch(err => {
    console.log(err)
    return res.status(500).send({ error: true, message: 'Database operation failed, please try again' })
  })
}

// Update sales product name 
exports.updateSalesReportName = async (req, res, next) => {
  const productName = req.body.productName
  const updatedName = req.body.updatedName

  await Sales.updateMany({ 'productName': productName }, {
    $set: { 'productName': updatedName }
  }).then(result => {
    return res.status(200).send({ error: false, message: `Updated sales product name successfully` })
  }).catch(err => {
    console.log(err)
    return res.status(500).send({ error: true, message: `Updating sales product name failed.` })
  })
}

// Delete daily sales product and update product's current quantity
exports.deleteSales = (req, res, next) => {
  const id = req.body.id
  const customer = req.body.customerName
  const product = req.body.productName

  Sales.findById(id).then(sales => { 
    if(!sales) return res.status(422).send({ error: true, message: 'Couldn\'t find the sales with the id specified' })
    else {
      if (sales.productName === product && sales.customerName === customer) {
        Product.find({ productName: sales.productName }).then(product => {
          if (!product) return res.status(401).send({ error: true, message: 'Deleting sales failed.' })
          Product.findByIdAndUpdate({ _id: product[0]._id }, { currentQty: (product[0].currentQty + sales.quantity) })
            .then(result => {
              Sales.findByIdAndDelete(id).then(val => { 
                return res.status(200).send({ error: false, message: `Deleted successfully` })
              }).catch(err => {
                console.log(err)
                return res.status(500).send({ error: true, message: 'Database operation failed, please try again' })
              })
            })
            .catch(err => {
              console.log(err)
              return res.status(500).send({ error: true, message: 'Deleted sales failed.' })
            })
        })
        .catch(err => {
          console.log(err)
          return res.status(500).send({ error: true, message: `Database operation failed, please try again` })
        })
      }
      else return res.status(500).send({ error: true, message: 'Product name or customer does not match' })
    }
  }).catch(err => {
    console.log(err)
    return res.status(422).send({ error: true, message: 'Couldn\'t find the sales with the id specified' })
  })
  
}