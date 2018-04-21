const request = require('request');

async function getInfo(url){
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

module.exports = {
  getInfo: getInfo
}