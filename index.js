require('dotenv').config();
const db = require('./db');
const server = require('./server');
const { bot } = require('./bot/index');

const utils = require('./bot/utils.js');
const { getTalk } = require('./bot/manager');

const Message = require('mongoose').model('Message');
const moment = require('moment');
moment.locale('ru');

// MENU
require('./bot/commands/start');

// get my lessons
require('./bot/commands/utils');
require('./bot/commands/schedule');

bot.on('text', async (msg, props) => {
  // console.log(msg, props);
  const dbMsg = Message({ msg });
  dbMsg.save(console.log);

  let talk = getTalk(msg.from.id);
  if (talk) {
    return talk.reply(msg);
  }
});

// Inline button callback
bot.on('callbackQuery', msg => {
  // todo delete message if questions single-use
  // bot.deleteMessage(msg.message.chat.id, msg.message.from.id)

  let talk = getTalk(msg.from.id);

  if (talk) {
    console.log('Talk found');
    talk.setAnswer(msg);
    talk.reply(msg);
  }
});

bot.start();
