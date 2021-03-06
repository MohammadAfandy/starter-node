const moment = require('moment');

const rangeDate = (start_date, end_date) => {
  let list_date = [];
  let start_date_obj = moment(start_date);
  let end_date_obj = moment(end_date);
  while (start_date_obj <= end_date_obj) {
    let obj = {
      date: start_date_obj.format("YYYY-MM-DD"),
      dayName: start_date_obj.format("dddd"),
      day: start_date_obj.format("DD"),
      month: start_date_obj.format("MM"),
      year: start_date_obj.format("YYYY"),
    };
    list_date.push(obj);
    start_date_obj = start_date_obj.add("1", "days");
  }

  return list_date;
}

exports.rangeDate = rangeDate;
