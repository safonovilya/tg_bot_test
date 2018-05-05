const Message = require('mongoose').model('Message')
const log = console.log; //TODO: init logger module and apply formatter

module.exports = (bot) => {

  // Hide keyboard
  bot.on('/hide', msg => {

    Message(msg).save(log)

    return bot.sendMessage(msg.from.id, 'Hide keyboard example. Type /back to show.', {replyMarkup: 'hide'});

  });

  // On location on contact message
  bot.on(['location', 'contact'], (msg, self) => {
    return bot.sendMessage(msg.from.id, `Thank you for ${ self.type }.`);
  });

};