const Purchases = require('../models/purchases')
const Product = require('../models/product')
const { validationResult } = require('express-validator')

/// Fetch purchases paginated
exports.fetchPurchases = async (req, res, next) => {
  try {
    let page
    if(req.query.page == null) page = 1
    else page = parseInt(req.query.page)

    let limit
    if(req.query.limit == null) limit = 15
    else limit = parseInt(req.query.limit)
    
    const skipIndex = (page - 1) * limit

    let purchases;
    if(req.query.searchWord == null){
      purchases = await Purchases.find().populate({path: "product", populate: { path: "category" }}).select(['-__v']).sort({ createdAt: -1 }).limit(limit).skip(skipIndex).exec()
    } 
    else {
      purchases = await Purchases.find({'product.productName' : {$regex : req.query.searchWord, $options : 'i'} }).populate({path: "product", populate: { path: "category" }}).select(['-__v']).sort({ createdAt: -1 }).limit(limit).skip(skipIndex).exec()
    } 
    const purchasesLength = await Purchases.estimatedDocumentCount();
    const result = {
      totalCount: purchasesLength,
      page: page,
      count: limit,
      items: purchases
    }
    return res.status(200).send({error: false, message: 'Successfully fetched all purchases', data: result })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: true, message: 'Database operation failed' })
  }
}

// Fetch all purchases
exports.fetchAllPurchases = async (req, res, next) => {
  try {   
    const purchases = await Purchases.find().populate({path: "product", populate: { path: "category" }}).select(['-__v']).sort({ createdAt: -1 })
    return res.status(200).send({error: false, message: 'Successfully fetched all purchases', data: purchases })
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: true, message: 'Database operation failed' })
  }
}

// Fetch all purchases
exports.fetchAllPurchasesByProducts = async (req, res, next) => {
    try {
        let page
        if(req.query.page == null) page = 1
        else page = parseInt(req.query.page)
    
        let limit
        if(req.query.limit == null) limit = 15
        else limit = parseInt(req.query.limit)
        
        const skipIndex = (page - 1) * limit

        let purchases;
        if(req.query.searchWord == null){
          purchases = await Purchases.find({product: req.params.productId}).populate({path: "product", populate: { path: "category" }}).select(['-__v']).sort({ createdAt: -1 }).limit(limit).skip(skipIndex).exec()
        } 
        else {
          purchases = await Purchases.find({product: req.params.productId, 'product.productName' : {$regex : req.query.searchWord, $options : 'i'} }).populate({path: "product", populate: { path: "category" }}).select(['-__v']).sort({ createdAt: -1 }).limit(limit).skip(skipIndex).exec()
        } 
    
        const allPurchases = await Purchases.find({product: req.params.productId})
        const result = {
          totalCount: allPurchases.length,
          page: page,
          count: limit,
          items: purchases
        }
        return res.status(200).send({error: false, message: 'Successfully fetched all purchases', data: result })
      } catch (error) {
        console.log(error)
        return res.status(500).send({ error: true, message: 'Database operation failed' })
      }
  }

// Delete purchase
exports.deletePurchase = (req, res, next) => {
  Purchases.findById(req.params.purchaseId).populate('product')
    .then(async(purchase) => {
      if (!purchase) return res.status(422).send({error: true, message: 'Couldn\'t find the purchase with the id specified' })
      Product.findByIdAndUpdate({ _id: purchase.product._id }, { currentQty: (purchase.product.currentQty - purchase.quantity), initialQty: (purchase.product.initialQty - purchase.quantity) })
        .then(result => {
          Purchases.findByIdAndDelete(req.params.purchaseId).then(val => { 
            return res.status(200).send({ error: false, message: `Deleted successfully` })
          }).catch(err => {
            console.log(err)
            return res.status(500).send({ error: true, message: 'Database operation failed, please try again' })
         })
      }).catch(err => {
        console.log(err)
        return res.status(500).send({ error: true, message: 'Deleting purchase failed.' })
      })
    }).catch((err) => {
      console.log(err)
      return res.status(500).send({ error: true, message: 'Deleting product failed.' })
    })
}