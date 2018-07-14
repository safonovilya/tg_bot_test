const Message = require('mongoose').model('Message');
const log = console.log;
const {bot} = require('../index');


bot.on(['/start', '/back'], msg => {

  let replyMarkup = bot.keyboard([
    ['/записаться', '/список'],
    ['/hide']
  ], {resize: true});

  Message(msg).save(log);

  return bot.sendMessage(msg.from.id, 'Начнем. Хотите записаться или посмотреть список тренировок?', {replyMarkup});

});
