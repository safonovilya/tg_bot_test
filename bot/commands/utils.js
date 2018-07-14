const {bot} = require('../index');
// const Message = require('mongoose').model('Message')
const log = console.log; //TODO: init logger module and apply formatter

// Hide keyboard
bot.on('/hide', msg => {
  return bot.sendMessage(msg.from.id, 'Hide keyboard example. Type /back to show.', {replyMarkup: 'hide'});
});

// On location on contact message
bot.on(['location', 'contact'], (msg, self) => {
  // Message(msg).save(log)
  return bot.sendMessage(msg.from.id, `Thank you for ${ self.type }.`);
});
