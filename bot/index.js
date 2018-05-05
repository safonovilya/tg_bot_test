const TOKEN = process.env.TELEGRAM_TOKEN;
const TeleBot = require('telebot');
const bot = new TeleBot(TOKEN);
const utils = require('./utils.js');

let list = utils.list;

// MENU
// get my lessons
// make appointment

// hashmap = {userId: talk}
const managerAnswers = {};
const routes = {};

require('./commands/start')(bot);
require('./commands/utils')(bot);
require('./commands/schedule')(bot, routes);

bot.on('text', async (msg, props) => {
  if (managerAnswers[msg.from.id]) {

    // getTalk -> match answers -> do stuff

  }

  if (msg.data && Object.keys(routes).indexOf(msg.data) !== -1){
    routes[msg.data](msg);
  }

});

// Inline button callback
bot.on('callbackQuery', msg => {
  // todo delete message if questions single-use
  // bot.deleteMessage(msg.message.chat.id, msg.message.from.id)

  // getTalk -> match answers -> do stuff

});


bot.start();
