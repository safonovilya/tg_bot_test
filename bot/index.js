const TOKEN = process.env.TELEGRAM_TOKEN;
const TeleBot = require('telebot');
const bot = new TeleBot(TOKEN);

module.exports = {bot};