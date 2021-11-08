const dayjs = require("dayjs");


//get current timestamp
exports.get_current_timestamp = (day = 0) => {
    let old_date = new Date();
  
    let date = new Date(old_date.setDate(old_date.getDate() + day));
  
    return dayjs(date, "YYYY-MM-DD HH:mm:ss.SSS").toDate();
  };