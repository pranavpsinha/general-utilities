const moment = require('moment');

function DateTimeUtil() {}

// convert array to map by pk
DateTimeUtil.prototype.getDateObj = function(input, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(input, format);
}

DateTimeUtil.prototype.formatDate = function(input, format = 'YYYY-MM-DD') {
  if(!input) return '';
  
  return moment(input).format(format);
}

DateTimeUtil.prototype.now = function() {
  return moment();
}

DateTimeUtil.prototype.addDaysToDate = function(input, nDays, format  = 'YYYY-MM-DD HH:mm:ss') {
  return moment(input, format).add(nDays, 'days');
}

DateTimeUtil.prototype.addHoursToDate = function(input, nHours, format  = 'YYYY-MM-DD HH:mm:ss') {
  return moment(input, format).add(nHours, 'hours');
}

DateTimeUtil.prototype.isDateBetween = function(stDate, enDate, input) {
  if (!(stDate && enDate)) return false;

  stDate = moment(stDate);
  enDate = moment(enDate);
  input  = moment(input || moment());

  return (input.isAfter(stDate) && input.isBefore(enDate));
}

DateTimeUtil.prototype.getDOW = function(input) {
  input = moment(input || moment());

  return input.day();
}

DateTimeUtil.prototype.dateDifferenceBetween = function(start, end, on='days') {
  start = moment(start || moment.now());
  end   = moment(end   || moment.now());

  return start.diff(end, on);
}

DateTimeUtil.prototype.substractDaysToDate = function(input, nDays, format  = 'DD/MM/YYYY, HH:mm') {
  return moment(input, format).subtract(nDays, 'days');
}

DateTimeUtil.prototype.addDeltaToMoment = function(delta = 600, input = moment.now(), deltaDef = 'seconds') {
  return moment(input).add(delta, deltaDef);
}

module.exports = new DateTimeUtil();