const {bot} = require('../index');
// const Message = require('mongoose').model('Message');
const moment = require('moment-timezone');
const log = console.log;
const { Talk, Question } = require('../talks');
const { getTalk, registerTalk } = require('../manager');
const { getAvailableDates } = require('../utils');

const routes = [];

function arrayToKeaboardObj(el) {
  return {text: el, callback: el}
}

function getStudioList(){
  return [{text:'bratiev', callback: 1}, {text: 'anoshkina', callback: 2}];
}

async function getLessonlist(){
  const data = await getAvailableDates();
  const master = data.reduce((result, currentValue, currentIndex, array) => {
    if (+currentValue.hcount > +currentValue.proved)
      result[currentValue.title] = true;
    return result;
  }, {});
  return Object.keys(master).map(arrayToKeaboardObj);
}

async function getTrenerlist() {

  const data = await getAvailableDates();
  const master = data.reduce((result, currentValue, currentIndex, array) => {
    if (+currentValue.hcount > +currentValue.proved)
      result[currentValue.master] = true;
    return result;
  }, {});
  return Object.keys(master).map(arrayToKeaboardObj);
}

async function getDateTimelist(resolvedQuestions) {

  // TODO: apply filters by resolved questions
  console.log(resolvedQuestions)

  const data = await getAvailableDates();
  const lesson = data.reduce((result, currentValue, currentIndex, array) => {
    const start = moment(+currentValue['date-start']*1000);
    const end = moment(+currentValue['date-end']*1000);
    //.tz('Asia/Yekaterinburg')
    const key = `${start.format('HH:mm')}-${end.format('HH:mm dd')}`;
    if (+currentValue.hcount > +currentValue.proved)
      result[key] = true;
    return result;
  }, {});
  return Object.keys(lesson).map(arrayToKeaboardObj);
}


function showAvailableDays (msg) {

  const days = ['Понедельник', 'Вторник'];
  // let keyArray = await getLessonListKB();
  let replyMarkup = bot.inlineKeyboard(days);
  return bot.sendMessage(msg.from.id, 'Вибирите день', {replyMarkup});
}

bot.on('/записаться', msg => {
  let talk = getTalk(msg.from.id);
  if (!talk) {
    talk = new Talk([
      new Question('Выберете тренера',{
        type: 'inlineKeyboard',
        answers: getTrenerlist()
      }),
      new Question('Выберете занятие',{
        type: 'inlineKeyboard',
        answers: getLessonlist()
      }),
      new Question('Выберете время',{
        type: 'inlineKeyboard',
        filterAnswers: getDateTimelist
      })
    ]);
    registerTalk(msg.from.id, talk)
  }
  talk.reply(msg);
});

function confirm(){
  let replyMarkup = bot.keyboard([
    [bot.button('contact', 'Подтвердить')]
  ], {resize: true, once: true});
}


// Inline buttons
bot.on('/список', async msg => {

  let keyArray = await showAvailableDays(msg);
  let replyMarkup = bot.inlineKeyboard(keyArray);
  return bot.sendMessage(msg.from.id, 'Вибири занятие', {replyMarkup});

});

routes['day'] = showAvailableDays;
