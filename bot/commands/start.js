const Message = require('mongoose').model('Message')
const log = console.log; //TODO: init logger module and apply formatter
const {bot} = require('../index');


bot.on(['/start', '/back'], msg => {

  let replyMarkup = bot.keyboard([
    ['/записаться', '/список'],
    ['/hide']
  ], {resize: true});

  Message(msg).save(log)

  return bot.sendMessage(msg.from.id, 'Начнем', {replyMarkup});

});
