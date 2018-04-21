const TOKEN = process.env.TELEGRAM_TOKEN;
const TeleBot = require('telebot');
const bot = new TeleBot(TOKEN);
const util = require('./util.js');

async function getAvailableDates() {
  // TODO
  // url+'&time_start=yyyy-mm-dd&time_end=yyyy-mm-dd'
  return util.getInfo(process.env.URL)
}

//TODO: get from API or DB
const STUDIOS = ['Аношкина', 'Братьев Кашириных'];
let list;

// On commands
bot.on(['/start', '/back'], msg => {

  let replyMarkup = bot.keyboard([
    ['/записаться', '/список'],
    ['/hide']
  ], {resize: true});

  return bot.sendMessage(msg.from.id, 'Начнем', {replyMarkup});

});

bot.on('/записаться', msg => {

  let replyMarkup = bot.keyboard([
    STUDIOS.map(x => bot.button(x))
  ], {resize: true, once: true});

  return bot.sendMessage(msg.from.id, 'Вибирете студию', {replyMarkup});

});

bot.on('text', async (msg, props) => {
  if (STUDIOS.indexOf(msg.text) !== -1) {
    let keyArray = await getLessonListKB((lesson => {
      return +lesson.place === STUDIOS.indexOf(msg.text) + 1
    }))
    let replyMarkup = bot.inlineKeyboard(keyArray);
    return bot.sendMessage(msg.from.id, 'Вибири занятие', {replyMarkup});
  }
});

// Hide keyboard
bot.on('/hide', msg => {
  return bot.sendMessage(
    msg.from.id, 'Hide keyboard example. Type /back to show.', {replyMarkup: 'hide'}
  );
});

// On location on contact message
bot.on(['location', 'contact'], (msg, self) => {
  return bot.sendMessage(msg.from.id, `Thank you for ${ self.type }.`);
});

// Inline buttons
bot.on('/список', async msg => {

  let keyArray = await getLessonListKB()
  let replyMarkup = bot.inlineKeyboard(keyArray);
  return bot.sendMessage(msg.from.id, 'Вибири занятие', {replyMarkup});

});

// Inline button callback
bot.on('callbackQuery', msg => {
  // todo delete message
  // bot.deleteMessage(msg.message.chat.id, msg.message.from.id)
  let replyMarkup = bot.keyboard([
    [  bot.button('contact', 'Подтвердить')]
  ], {resize: true, once: true});

  let lesson = list[+msg.data];
  let theDate = new Date(lesson['date-start'] * 1000);
  let date = theDate.toGMTString();
  return bot.sendMessage(msg.message.chat.id, `Запись к ${lesson.master} на ${ date }`, {replyMarkup});
});

async function getLessonListKB(filter) {

  list = list || await getAvailableDates();
  let keyArray = [];
  let row = [];
  let count = 0;
  for (let i in list) {
    if (!filter || (typeof filter == 'function' && filter(list[i]))) {

      let theDate = new Date(list[i]['date-start'] * 1000);

      //TODO uniq id timestemp + place
      row.push(
        bot.inlineButton(
          (list[i].master + ' ' + theDate.toGMTString()),
          {callback: i}
        )
      );
      count++
    }
    if (count % 2 === 0 || i === list.length - 1) {
      keyArray.push(row);
      row = []
    }
  }
  if (row.length) {
    keyArray.push(row);
  }
  return keyArray
}

bot.start();