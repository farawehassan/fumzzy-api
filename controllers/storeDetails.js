const Product = require('../models/product');
const Sales = require('../models/sales');

// Fetch store details
exports.fetchDetails = async (req, res, next) => {
  let cpNetWorth = 0.00;
  let spNetWorth = 0.00;
  let totalItems = 0.00;
  let totalSalesMade = 0.00;
  let totalProfitMade = 0.00;
  try {
    const products = await Product.find();
    const sales = await Sales.find();

    for (i = 0; i < products.length; i++) {
      cpNetWorth += parseFloat(products[i].costPrice) * parseFloat(products[i].currentQty);
      spNetWorth += parseFloat(products[i].sellingPrice) * parseFloat(products[i].currentQty);
      totalItems += parseFloat(products[i].currentQty);
    }
    for (i = 0; i < sales.length; i++) {
      totalSalesMade += parseFloat(sales[i].totalPrice);
      totalProfitMade += parseFloat(sales[i].quantity) * (parseFloat(sales[i].unitPrice) - parseFloat(sales[i].costPrice));
    }
    var storeDetails =  {
      cpNetWorth: cpNetWorth.toString(),
      spNetWorth: spNetWorth.toString(),
      totalItems: totalItems.toString(),
      totalSalesMade: totalSalesMade.toString(),
      totalProfitMade: totalProfitMade.toString(),
    }; 
    return res.status(200).send({ error: false, message: 'Store details successfully fetched', data: storeDetails }); 
  } catch (error) {
    console.log(err);
    return res.status(500).send({ error: true, message: 'Database operation failed, please try again' });
  }

}  