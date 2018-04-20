const request = require('request');
const url = 'http://aeroyoga74.ru/schedule';
const cheerio = require('cheerio');

function getInfo(url){
  return new Promise(function (resolve, reject) {
    request.get(url, function (reuest, incomingMessage, body) {
      const $ = cheerio.load(body)
      let result = [];
      $('[id*=schedule]').filter(function () {
        return $(this).find('.lesson_is_close').length
      }).each(function () {
        let time = $(this).find('button h3 strong').text()
        let title = $(this).find('[name="title"]').text()
        result.push([time + " " + title])
      })
      resolve(result)
    });
  });
}

module.exports = {
  getInfo: getInfo
}