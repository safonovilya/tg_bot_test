const {bot} = require('../index');
const Message = require('mongoose').model('Message')
const log = console.log; //TODO: init logger module and apply formatter
const {Talk, Question}= require('../talks')
const {getTalk, registerTalk} = require('../manager')

const routes = [];

// should be DB storage
function getlistStudios(){
  return [{text:'bratiev', callback: 1}, {text: 'anoshkina', callback: 2}];
}


function showAvailableDays (msg) {

}

bot.on('/записаться', msg => {

  let talk = getTalk(msg.from.id);
  if (talk) {
    // wanna finish with it?
  } else {
    talk = new Talk([
      new Question('Studio',{
        type: 'inlineKeyboard',
        answers: getlistStudios()
      })
    ]);
    registerTalk(msg.from.id, talk)
  }
  talk.reply(msg);

  /*
  let replyMarkup = bot.inlineKeyboard([
    [bot.inlineButton('День недели', {callback: 'day'}), bot.inlineButton('Тренер', {callback: 'master'})],
    [bot.inlineButton('Студия', {callback: 'studio'})]
  ]);*/
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

routes['day'] = showAvailableDays;
