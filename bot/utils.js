const request = require('request');
const moment = require('moment');
let list;
const periodInDays = 7;

async function getInfo(url) {
  return new Promise(function (resolve, reject) {
    request.get(url, function (reuest, incomingMessage, body) {
      try {
        resolve(JSON.parse(body))
      } catch (e) {
        reject(e)
      }
    });
  });
}


async function getAvailableDates() {
  const today = moment();
  const endOfPeriod = moment().add(periodInDays, 'days');
  return getInfo(`${process.env.API_URL}&time_start=${today.format('YYYY-MM-DD')}&time_end=${endOfPeriod.format('YYYY-MM-DD')}`)
}

module.exports = {
  list: list,
  getAvailableDates: getAvailableDates
}
