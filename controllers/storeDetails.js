const Product = require('../models/product');
const Sales = require('../models/sales');
const Purchases = require('../models/purchases');
const Expenses = require('../models/expenses');

// Fetch store details
exports.fetchDetails = async (req, res, next) => {
  let cpNetWorth = 0.00;
  let spNetWorth = 0.00;
  let totalItems = 0.00;

  let totalSalesMade = 0.00;
  let totalPurchases = 0.00;
  let totalExpenses = 0.00;
  let totalProfitMade = 0.00;

  try {
    const products = await Product.find();
    const sales = await Sales.find();
    const purchases = await Purchases.find();
    const expenses = await Expenses.find();

    for (i = 0; i < products.length; i++) {
      cpNetWorth += parseFloat(products[i].costPrice) * parseFloat(products[i].currentQty);
      spNetWorth += parseFloat(products[i].sellingPrice) * parseFloat(products[i].currentQty);
      totalItems += parseFloat(products[i].currentQty);
    }
    for (i = 0; i < sales.length; i++) {
      totalSalesMade += parseFloat(sales[i].totalPrice);
      totalProfitMade += parseFloat(sales[i].quantity) * (parseFloat(sales[i].unitPrice) - parseFloat(sales[i].costPrice));
    }
    for (i = 0; i < purchases.length; i++) {
      totalPurchases += parseFloat(purchases[i].costPrice);
    }
    for (i = 0; i < expenses.length; i++) {
      totalExpenses += parseFloat(expenses[i].amount);
    }
    var storeDetails =  {
      inventoryCostPrice: cpNetWorth,
      inventorySellingPrice: spNetWorth,
      inventoryProfit: spNetWorth - cpNetWorth,
      inventoryItems: totalItems,

      totalSales: totalSalesMade,
      totalPurchases: totalPurchases,
      totalExpenses: totalExpenses,
      totalProfitMade: totalProfitMade
    }; 
    return res.status(200).send({ error: false, message: 'Store details successfully fetched', data: storeDetails }); 
  } catch (error) {
    console.log(err);
    return res.status(500).send({ error: true, message: 'Database operation failed, please try again' });
  }

} 

// Function to get all trades in the database
// exports.fetchDetailsHistory = async (req, res, next) => {
//   try {
//     var newDate = new Date();

//     var today = newDate.getTime()
//     var yesterday = 
//     var lastWeekStart = newDate.getTime() - (14 * 24 * 60 * 60 * 1000);
//     var lastWeekEnd = newDate.getTime() - (7 * 24 * 60 * 60 * 1000);
//     var thisWeekStart = lastWeekEnd;
//     var thisWeekEnd = newDate;

//     const allTrades = await Trade.find().sort('created_at');
//     const activeTrades = await Trade.find({status : 'In Progress'}).sort('created_at');
//     const allUser = await User.find().sort('created_at');
//     const lastUsers = await User.find().sort('created_at').limit(3);

//     const userLastWeekStart = await User.find({ 
//       created_at: {
//         $gte: lastWeekStart,
//         $lt: lastWeekEnd
//       }
//     }).sort('created_at');

//     const userLastWeekEnd = await User.find({ 
//       created_at: {
//         $gte: thisWeekStart,
//         $lt: thisWeekEnd
//       }
//     }).sort('created_at'); 

//     var userRate = ((userLastWeekEnd.length - userLastWeekStart.length) / (userLastWeekEnd.length + userLastWeekStart.length)) * 100;

//     const tradeLastWeekStart = await Trade.find({ 
//       created_at: {
//         $gte: lastWeekStart,
//         $lt: lastWeekEnd
//       }
//     }).sort('created_at');

//     const tradeLastWeekEnd = await Trade.find({ 
//       created_at: {
//         $gte: thisWeekStart,
//         $lt: thisWeekEnd
//       }
//     }).sort('created_at'); 

//     var totalTradeRate = ((tradeLastWeekEnd.length - tradeLastWeekStart.length) / (tradeLastWeekEnd.length + tradeLastWeekStart.length)) * 100;


//     const activeTradeLastWeekStart = await Trade.find({
//       status : 'In Progress', 
//       created_at: {
//         $gte: lastWeekStart,
//         $lt: lastWeekEnd
//       }
//     }).sort('created_at');

//     const activeTradeLastWeekEnd = await Trade.find({ 
//       status : 'In Progress', 
//       created_at: {
//         $gte: thisWeekStart,
//         $lt: thisWeekEnd
//       }
//     }).sort('created_at'); 

//     var activeTradeRate = ((activeTradeLastWeekEnd.length - activeTradeLastWeekStart.length) / (activeTradeLastWeekEnd.length + activeTradeLastWeekStart.length)) * 100;

//     var details =  {
//       totalUsers: allUser.length,
//       lastUsers: lastUsers,
//       userRate: Number((userRate).toFixed(1)),
//       totalTransactions: allTrades.length,
//       totalTradeRate: Number((totalTradeRate).toFixed(1)),
//       totalTransactionsInProgress: activeTrades.length,
//       transactionsInProgressTradeRate: Number((activeTradeRate).toFixed(1)),
      
//     }; 
//     return res.status(200).send({ error: false, message: "Sucessfully fetched summary", data: details });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ error: true, message: "Database operation failed" });
//   }
// }; 