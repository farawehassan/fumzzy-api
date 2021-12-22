const Product = require('../models/product')
const Sales = require('../models/sales')
const Customer = require('../models/customer')
const Purchases = require('../models/purchases')
const Expenses = require('../models/expenses')
const Creditors = require('../models/creditor')
const RepaymentHistory = require('../models/repaymentHistory')
const Helpers = require('../helpers/helper')

// Fetch store details
exports.fetchDetails = async (req, res, next) => {
  let cpNetWorth = 0.00;
  let spNetWorth = 0.00;
  let totalItems = 0.00;

  let outstandingSales = 0.00;
  let outstandingSalesVolume = 0;
  let outstandingPurchase = 0.00;
  let outstandingPurchaseVolume = 0;

  try {
    const products = await Product.find()
    const customers = await Customer.find({ 'reports.paid': false })
    const creditors = await Creditors.find()

    var outstandingPaymentMadeToday = await RepaymentHistory.aggregate([
      {$match: {paymentMode: 'Cash', createdAt: {$gte: Helpers.getCurrentTimestamp(0)}}},
      {$group: { _id: null, total: { $sum: '$amount' }}}
    ])
    outstandingPaymentMadeToday = Helpers.getTotalValue(outstandingPaymentMadeToday)

    const todayOutstandingCustomers = await Customer.find({ 'reports.paid': false, 'reports.soldAt': { $gte: Helpers.getCurrentTimestamp(0), $lte: Helpers.getCurrentEndDate() } })
    var todayOutstandingBalance = 0;
    for(i = 0; i < todayOutstandingCustomers.length; i++){
      for(j = 0; j < todayOutstandingCustomers[i]['reports'].length; j++){
        if(todayOutstandingCustomers[i]['reports'][j]['soldAt'] > Helpers.getCurrentTimestamp(0)){
          todayOutstandingBalance += (todayOutstandingCustomers[i]['reports'][j]['totalAmount'] - todayOutstandingCustomers[i]['reports'][j]['paymentMade'])
        }
      }
    }


    /// Products section
    for (i = 0; i < products.length; i++) {
      cpNetWorth += parseFloat(products[i].costPrice) * parseFloat(products[i].currentQty)
      spNetWorth += parseFloat(products[i].sellingPrice) * parseFloat(products[i].currentQty)
      totalItems += parseFloat(products[i].currentQty)
    }

    /// Customer section
    for (i = 0; i < customers.length; i++) { 
      for(j = 0; j < customers[i].reports.length; j++) {
        outstandingSales += (parseFloat(customers[i].reports[j].totalAmount) - parseFloat(customers[i].reports[j].paymentMade)) 
        outstandingSalesVolume += 1
      }
    }

    /// Creditor section
    for (i = 0; i < creditors.length; i++) { 
      for(j = 0; j < creditors[i].reports.length; j++) {
        outstandingPurchase += parseFloat(creditors[i].reports[j].amount)
        outstandingPurchaseVolume += 1
      }
    }
    
    
    var storeDetails =  {
      inventoryCostPrice: cpNetWorth,
      inventorySellingPrice: spNetWorth,
      inventoryProfit: spNetWorth - cpNetWorth,
      inventoryItems: totalItems,
      outstandingSales: outstandingSales,
      outstandingSalesVolume: outstandingSalesVolume,
      outstandingPurchase: outstandingPurchase,
      outstandingPurchaseVolume: outstandingPurchaseVolume,
      outstandingPaymentMadeToday: outstandingPaymentMadeToday,
      todayOutstandingBalance: todayOutstandingBalance
    }; 

    return res.status(200).send({ error: false, message: 'Store details successfully fetched', data: storeDetails }); 
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: true, message: 'Database operation failed, please try again' });
  }

} 

// Fetch store details
exports.fetchDetailsChart = async (req, res, next) => {

  try {

    /// Sales section
    var todaySales = await Sales.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(0), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ])
    todaySales = Helpers.getTotalValue(todaySales)
    
    var yesterdaySales = await Sales.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-1), $lte: Helpers.getCurrentDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ])
    yesterdaySales = Helpers.getTotalValue(yesterdaySales)

    var weekSales = await Sales.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-7), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ])
    weekSales = Helpers.getTotalValue(weekSales)

    var monthSales = await Sales.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-31), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ])
    monthSales = Helpers.getTotalValue(monthSales)

    var sixMonthSales = await Sales.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-184), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ])
    sixMonthSales = Helpers.getTotalValue(sixMonthSales)

    var allSales = await Sales.aggregate([
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ])
    allSales = Helpers.getTotalValue(allSales)



    /// Transferred sales section
    var todayTransferredSales = await Sales.aggregate([
      {
        $match: { paymentMode: 'Transfer' ,createdAt: { $gte: Helpers.getCurrentTimestamp(0), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ])
    todayTransferredSales = Helpers.getTotalValue(todayTransferredSales)

    var yesterdayTransferredSales = await Sales.aggregate([
      {
        $match: { paymentMode: 'Transfer', createdAt: { $gte: Helpers.getCurrentTimestamp(-1), $lte: Helpers.getCurrentDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ])
    yesterdayTransferredSales = Helpers.getTotalValue(yesterdayTransferredSales)

    var weekTransferredSales = await Sales.aggregate([
      {
        $match: { paymentMode: 'Transfer', createdAt: { $gte: Helpers.getCurrentTimestamp(-7), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ])
    weekTransferredSales = Helpers.getTotalValue(weekTransferredSales)

    var monthTransferredSales = await Sales.aggregate([
      {
        $match: { paymentMode: 'Transfer', createdAt: { $gte: Helpers.getCurrentTimestamp(-31), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ])
    monthTransferredSales = Helpers.getTotalValue(monthTransferredSales)

    var sixMonthTransferredSales = await Sales.aggregate([
      {
        $match: { paymentMode: 'Transfer', createdAt: { $gte: Helpers.getCurrentTimestamp(-184), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ])
    sixMonthTransferredSales = Helpers.getTotalValue(sixMonthTransferredSales)

    var allTransferredSales = await Sales.aggregate([
      {
        $match: { paymentMode: 'Transfer' }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ])
    allTransferredSales = Helpers.getTotalValue(allTransferredSales)



    /// Profit section
    var todayProfit = await Sales.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(0), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: { 
          $multiply : [ { $subtract: [ '$unitPrice', '$costPrice' ] }, '$quantity' ] 
        } } },
      }
    ])
    todayProfit = Helpers.getTotalValue(todayProfit)

    var yesterdayProfit = await Sales.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-1), $lte: Helpers.getCurrentDate() } }
      },
      {
        $group: { _id: null, total: { $sum: { 
          $multiply : [ { $subtract: [ '$unitPrice', '$costPrice' ] }, '$quantity' ] 
        } } },
      }
    ])
    yesterdayProfit = Helpers.getTotalValue(yesterdayProfit)

    var weekProfit = await Sales.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-7), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: { 
          $multiply : [ { $subtract: [ '$unitPrice', '$costPrice' ] }, '$quantity' ] 
        } } },
      }
    ])
    weekProfit = Helpers.getTotalValue(weekProfit)

    var monthProfit = await Sales.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-31), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: { 
          $multiply : [ { $subtract: [ '$unitPrice', '$costPrice' ] }, '$quantity' ] 
        } } },
      }
    ])
    monthProfit = Helpers.getTotalValue(monthProfit)

    var sixMonthProfit = await Sales.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-184), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: { 
          $multiply : [ { $subtract: [ '$unitPrice', '$costPrice' ] }, '$quantity' ] 
        } } },
      }
    ])
    sixMonthProfit = Helpers.getTotalValue(sixMonthProfit)

    var allProfit = await Sales.aggregate([
      {
        $group: { _id: null, total: { $sum: { 
          $multiply : [ { $subtract: [ '$unitPrice', '$costPrice' ] }, '$quantity' ] 
        } } },
      }
    ])
    allProfit = Helpers.getTotalValue(allProfit)



    /// Expenses section
    var todayExpenses = await Expenses.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(0), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      }
    ])
    todayExpenses = Helpers.getTotalValue(todayExpenses)

    var yesterdayExpenses = await Expenses.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-1), $lte: Helpers.getCurrentDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      }
    ])
    yesterdayExpenses = Helpers.getTotalValue(yesterdayExpenses)

    var weekExpenses = await Expenses.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-7), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      }
    ])
    weekExpenses = Helpers.getTotalValue(weekExpenses)

    var monthExpenses = await Expenses.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-31), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      }
    ])
    monthExpenses = Helpers.getTotalValue(monthExpenses)

    var sixMonthExpenses = await Expenses.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-184), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      }
    ])
    sixMonthExpenses = Helpers.getTotalValue(sixMonthExpenses)

    var allExpenses = await Expenses.aggregate([
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      }
    ])
    allExpenses = Helpers.getTotalValue(allExpenses)


    /// Purchases section
    var todayPurchases = await Purchases.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(0), $lte: Helpers.getCurrentEndDate(0) } }
      },
      {
        $group: { _id: null, total: { $sum: { $multiply : [ '$costPrice', '$quantity' ] } } },
      }
    ])
    todayPurchases = Helpers.getTotalValue(todayPurchases)

    var yesterdayPurchases = await Purchases.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-1), $lte: Helpers.getCurrentDate() } }
      },
      {
        $group: { _id: null, total: { $sum: { $multiply : [ '$costPrice', '$quantity' ] } } },
      }
    ])
    yesterdayPurchases = Helpers.getTotalValue(yesterdayPurchases)

    var weekPurchases = await Purchases.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-7), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: { $multiply : [ '$costPrice', '$quantity' ] } } },
      }
    ])
    weekPurchases = Helpers.getTotalValue(weekPurchases)

    var monthPurchases = await Purchases.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-31), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: { $multiply : [ '$costPrice', '$quantity' ] } } },
      }
    ])
    monthPurchases = Helpers.getTotalValue(monthPurchases)

    var sixMonthPurchases = await Purchases.aggregate([
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-184), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: { $multiply : [ '$costPrice', '$quantity' ] } } },
      }
    ])
    sixMonthPurchases = Helpers.getTotalValue(sixMonthPurchases)

    var allPurchases = await Purchases.aggregate([
      {
        $group: { _id: null, total: { $sum: { $multiply : [ '$costPrice', '$quantity' ] } } },
      }
    ])
    allPurchases = Helpers.getTotalValue(allPurchases)

    var storeDetails = {
      yesterday: {yesterdaySales, yesterdayTransferredSales, yesterdayProfit, yesterdayExpenses, yesterdayPurchases},
      today: {todaySales, todayTransferredSales, todayProfit, todayExpenses, todayPurchases},
      week: {weekSales, weekTransferredSales, weekProfit, weekExpenses, weekPurchases},
      thisMonth: {monthSales, monthTransferredSales, monthProfit, monthExpenses, monthPurchases},
      sixMonth: {sixMonthSales, sixMonthTransferredSales, sixMonthProfit, sixMonthExpenses, sixMonthPurchases},
      allTime: {allSales, allTransferredSales, allProfit, allExpenses, allPurchases},
    }

    return res.status(200).send({ error: false, message: 'Store details successfully fetched', data: storeDetails }); 
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: true, message: 'Database operation failed, please try again' });
  }

} 
