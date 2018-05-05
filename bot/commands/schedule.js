const Message = require('mongoose').model('Message')
const log = console.log; //TODO: init logger module and apply formatter

module.exports = (bot, routes) =>{

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

  function confirm(){
    let replyMarkup = bot.keyboard([
      [bot.button('contact', 'Подтвердить')]
    ], {resize: true, once: true});
  }


  // Inline buttons
  bot.on('/список', async msg => {

    let keyArray = await getLessonListKB();
    let replyMarkup = bot.inlineKeyboard(keyArray);
    return bot.sendMessage(msg.from.id, 'Вибири занятие', {replyMarkup});

  });

  routes['day'] = showAvailableDays

};

function showAvailableDays (msg) {

}