const TOKEN = process.env.TELEGRAM_TOKEN;
const TeleBot = require('telebot');
const bot = new TeleBot(TOKEN);
const utils = require('./utils.js');

//TODO: get from API or DB
const STUDIOS = ['Аношкина', 'Братьев Кашириных'];
let list = utils.list;

// MENU
// get my lessons
// make appointment

// hashmap = {userId: scenario}
const managerAnswers = {};

// On commands
bot.on(['/start', '/back'], msg => {

  let replyMarkup = bot.keyboard([
    ['/записаться', '/список'],
    ['/hide']
  ], {resize: true});

  return bot.sendMessage(msg.from.id, 'Начнем', {replyMarkup});

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

bot.on('/записаться', msg => {

  managerAnswers[msg.from.id] = {
    date: null,
    time: null,
    master: null,
    contact: null,
    filter: null,
  };
  let replyMarkup = bot.inlineKeyboard([
    [bot.inlineButton('День недели', {callback: 'day'}), bot.inlineButton('Тренер', {callback: 'master'})],
    [bot.inlineButton('Студия', {callback: 'studio'})]
  ]);

  /*
    let replyMarkup = bot.keyboard([
      STUDIOS.map(x => bot.button(x))
    ], {resize: true, once: true});
  */

  return bot.sendMessage(msg.from.id, 'Выбрать', {replyMarkup});

});

bot.on('text', async (msg, props) => {
  if (managerAnswers[msg.from.id]) {

  }
  if (STUDIOS.indexOf(msg.text) !== -1) {
    let keyArray = await getLessonListKB((lesson => {
      return +lesson.place === STUDIOS.indexOf(msg.text) + 1
    }));
    let replyMarkup = bot.inlineKeyboard(keyArray);
    return bot.sendMessage(msg.from.id, 'Вибири занятие', {replyMarkup});
  }
});

// Inline buttons
bot.on('/список', async msg => {

  let keyArray = await getLessonListKB();
  let replyMarkup = bot.inlineKeyboard(keyArray);
  return bot.sendMessage(msg.from.id, 'Вибири занятие', {replyMarkup});

});

// Inline button callback
bot.on('callbackQuery', msg => {
  // todo delete message
  // bot.deleteMessage(msg.message.chat.id, msg.message.from.id)
  let replyMarkup = bot.keyboard([
    [bot.button('contact', 'Подтвердить')]
  ], {resize: true, once: true});
/* //todo move to manager
  if (/\d/.test(msg.data)){
    let lesson = list[+msg.data];
    let theDate = new Date(lesson['date-start'] * 1000);
    let date = theDate.toGMTString();
    return bot.sendMessage(msg.message.chat.id, `Запись к ${lesson.master} на ${ date }`, {replyMarkup});
  } else */if (msg.data === 'day') {

    // TODO: get Available Dates
    let replyMarkup = bot.inlineKeyboard([
      [bot.inlineButton('Понедельник', {callback: 1}), bot.inlineButton('Вторник',{callback: 1})],
      [bot.inlineButton('Среда',{callback: 1}), bot.inlineButton('Четверг',{callback: 1})]
    ]);

    return bot.sendMessage(msg.from.id, 'Выбрать', {replyMarkup});
  }

});

/**
 * prepare Keyboard array
 * @param filter
 * @returns {Promise<Array>}
 */
async function getLessonListKB(filter) {

  list = list || await utils.getAvailableDates();
  let keyArray = [];
  let row = [];
  let count = 0;
  for (let i in list) {
    if (!filter || (typeof filter === 'function' && list.hasOwnProperty(i) && filter(list[i]))) {

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
