const dayjs = require("dayjs")


//get current timestamp
exports.getCurrentTimestamp = (day = 0) => {
    var currDate = new Date(new Date().getTime())
    currDate.setHours(0, 0, 0, 0)

    let date = new Date(currDate.setDate(currDate.getDate() + day))
  
    return dayjs(date, "YYYY-MM-DD HH:mm:ss.SSS").toDate()
}

//get current timestamp
exports.getCurrentDate = () => {
  var currDate = new Date(new Date().getTime())
  currDate.setHours(0, 0, 0, 0)

  return currDate
}

//get current timestamp
exports.getCurrentStartDate = () => {
  var currDate = new Date(new Date().getTime())
  currDate.setHours(0, 59, 59, 0)

  return currDate
}

//get current timestamp
exports.getCurrentEndDate = () => {
  var currDate = new Date(new Date().getTime())
  currDate.setHours(23, 59, 59, 0)

  return currDate
}


/// getting the total value in an object of a list if it is not empty
/// It returns 0 if it is empty
exports.getTotalValue = (items) => {
  if(items.length === 0) return 0
  else return items[0]['total']
}

/// getting the total value in an object of a list if it is not empty
/// It returns 0 if it is empty
exports.getTotalOutstandingBalanceValue = (items) => {
  var outstandingBalance = 0
  for(i = 0; i < items.length; i++){
    outstandingBalance += items[i]['result']['totalAmount'] - items[i]['result']['amountPayed']
  }
  return outstandingBalance
}

/// Converting date value from String to Date format
exports.getDateValue = (date) => {
  return dayjs(new Date(date), "YYYY-MM-DD HH:mm:ss.SSS").toDate()
}