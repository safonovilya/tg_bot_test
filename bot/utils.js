const request = require('request');
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
  return getInfo(process.env.API_URL)
}

module.exports = {
  list: list,
  getAvailableDates: getAvailableDates
}