const dayjs = require("dayjs");


//get current timestamp
exports.getCurrentTimestamp = (day = 0) => {
    var currDate = new Date(new Date().getTime());
    currDate.setHours(0, 0, 0, 0);
  
    let date = new Date(currDate.setDate(currDate.getDate() + day));
  
    return dayjs(date, "YYYY-MM-DD HH:mm:ss.SSS").toDate();
};

//get current timestamp
exports.getCurrentDate = () => {
  var currDate = new Date(new Date().getTime());
  currDate.setHours(0, 0, 0, 0);

  return currDate;
};

//get current timestamp
exports.getCurrentEndDate = () => {
  var currDate = new Date(new Date().getTime());
  currDate.setHours(23, 59, 59, 0);

  return currDate;
};