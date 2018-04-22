const request = require('request');
const bot = require('./index').bot
let list;

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
  // TODO
  // url+'&time_start=yyyy-mm-dd&time_end=yyyy-mm-dd'
  return getInfo(process.env.URL)
}

module.exports = {
  list: list,
  getAvailableDates: getAvailableDates
}