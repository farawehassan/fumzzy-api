const Product = require('../models/product')
const Sales = require('../models/sales')
const Customer = require('../models/customer')
const Purchases = require('../models/purchases')
const Expenses = require('../models/expenses')
const Creditors = require('../models/creditor')
const Helpers = require("../helpers/helper")

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
    const sales = await Sales.find()
    const customers = await Customer.find({ 'reports.paid': false })
    const creditors = await Creditors.find()


    /// Products section
    for (i = 0; i < products.length; i++) {
      cpNetWorth += parseFloat(products[i].costPrice) * parseFloat(products[i].currentQty)
      spNetWorth += parseFloat(products[i].sellingPrice) * parseFloat(products[i].currentQty)
      totalItems += parseFloat(products[i].currentQty)
    }

    /// Sales section
    for (i = 0; i < sales.length; i++) {
      totalSalesMade += parseFloat(sales[i].totalPrice);
      totalProfitMade += parseFloat(sales[i].quantity) * (parseFloat(sales[i].unitPrice) - parseFloat(sales[i].costPrice))
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
      outstandingPurchaseVolume: outstandingPurchaseVolume
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
    
    //const sales = await Sales.find()


    /// Sales section
    const todaySales = await Sales.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(0), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ]

    const yesterdaySales = await Sales.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-1), $lte: Helpers.getCurrentDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ]

    const weekSales = await Sales.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-7), $lte: new Date() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ]

    const monthSales = await Sales.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-31), $lte: new Date() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ]

    const sixMonthSales = await Sales.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-184), $lte: new Date() } }
      },
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ]

    const allSales = await Sales.aggregate[
      {
        $group: { _id: null, total: { $sum: '$totalPrice' } },
      }
    ]



    /// Expenses section
    const todayExpenses = await Expenses.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(0), $lte: Helpers.getCurrentEndDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      }
    ]

    const yesterdayExpenses = await Expenses.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-1), $lte: Helpers.getCurrentDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      }
    ]

    const weekExpenses = await Expenses.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-7), $lte: new Date() } }
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      }
    ]

    const monthExpenses = await Expenses.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-31), $lte: new Date() } }
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      }
    ]

    const sixMonthExpenses = await Expenses.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-184), $lte: new Date() } }
      },
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      }
    ]

    const allExpenses = await Expenses.aggregate[
      {
        $group: { _id: null, total: { $sum: '$amount' } },
      }
    ]


    /// Purchases section
    const todayPurchases = await Purchases.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(0), $lte: Helpers.getCurrentEndDate(0) } }
      },
      {
        $group: { _id: null, total: { $sum: '$costPrice' } },
      }
    ]

    const yesterdayPurchases = await Purchases.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-1), $lte: Helpers.getCurrentDate() } }
      },
      {
        $group: { _id: null, total: { $sum: '$costPrice' } },
      }
    ]

    const weekPurchases = await Purchases.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-7), $lte: new Date() } }
      },
      {
        $group: { _id: null, total: { $sum: '$costPrice' } },
      }
    ]

    const monthPurchases = await Purchases.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-31), $lte: new Date() } }
      },
      {
        $group: { _id: null, total: { $sum: '$costPrice' } },
      }
    ]

    const sixMonthPurchases = await Purchases.aggregate[
      {
        $match: { createdAt: { $gte: Helpers.getCurrentTimestamp(-184), $lte: new Date() } }
      },
      {
        $group: { _id: null, total: { $sum: '$costPrice' } },
      }
    ]

    const allPurchases = await Purchases.aggregate[
      {
        $group: { _id: null, total: { $sum: '$costPrice' } },
      }
    ]

    var storeDetails = {
      yesterday: [yesterdaySales, yesterdaySales, yesterdayExpenses, yesterdayPurchases],
      today: [todaySales, todaySales, todayExpenses, todayPurchases],
      thisMonth: [monthSales, monthSales, monthExpenses, monthPurchases],
      sixMonth: [sixMonthSales, sixMonthSales, sixMonthExpenses, sixMonthPurchases],
      allTime: [allSales, allSales, allExpenses, allPurchases],
    }
    
    console.log(storeDetails)

    return res.status(200).send({ error: false, message: 'Store details successfully fetched', data: storeDetails }); 
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: true, message: 'Database operation failed, please try again' });
  }

} 
