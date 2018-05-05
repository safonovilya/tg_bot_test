class Talks {

  constructor (questions) {
    this.questions = questions;
    this.active = null;
  }

  getQuestion () {

    // if has active question - show his leafs

    // if array
    // show branch start button (inlineButton)
    /*let replyMarkup = bot.inlineKeyboard([
      [bot.inlineButton('Понедельник', {callback: 1}), bot.inlineButton('Вторник',{callback: 1})],
      [bot.inlineButton('Среда',{callback: 1}), bot.inlineButton('Четверг',{callback: 1})]
    ]);

    return bot.sendMessage(msg.from.id, 'Выбрать', {replyMarkup});*/
  }

  matchAnswer () {
    // TODO: http://thecodebarbarian.com/a-nodejs-perspective-on-mongodb-34-graphlookup
    // use mongo text search
  }

}

/**
 *
 * Question object - it's a branch of talk
 * root question completed then leaf have question === null
 */
class Question {
  constructor(){
    this.answer = '';
    this.questions = null;
    this.active = false;
    this.singleUse = false;
  }
}