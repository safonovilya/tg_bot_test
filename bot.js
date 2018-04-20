const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('node-telegram-bot-api');
const options = {
  polling: true
};
const bot = new TelegramBot(TOKEN, options);
const util = require('./util.js')

// Matches /love
bot.onText(/\/love/, function onLoveText(msg) {
  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: [
        ['Yes, you are the bot of my life ❤'],
        ['No, sorry there is another one...']
      ]
    })
  };
  bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
});

bot.onText(/\/getlist/, async function onEchoText(msg, match) {
  console.log('hello')
  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: await getAvailableDates()
    })
  };
  bot.sendMessage(msg.chat.id, 'what date?', opts);
});

async function getAvailableDates(){
  var url =  process.env.URL;
  return util.getInfo(url)
}