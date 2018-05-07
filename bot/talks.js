const {bot} = require('./index');

//TODO: expire state
class Talk {

  constructor(questions, options = {}) {
    this.questions = questions;
    this.active = this.questions && this.questions.length ? this.questions[0] : null;
    this.onEnd = options.callback || function (msg){ bot.sendMessage(msg.from.id, 'It was nice talking with you!'); }
  }

  reply(msg) {
    let replyMarkup;
    this.nextQuestion();
    if (!this.active){
      return this.endTalk(msg);
    }
    replyMarkup = this.buildMarkup();

    return bot.sendMessage(msg.from.id, 'Выбрать', {replyMarkup});
  }

  nextQuestion() {

    if (this.active && !this.active.isReady()) {
      return this.active;
    }

    // TODO: if active question have sub questions - show his leafs
    // NOTE: to make `resolved questions` array to have ability re-answer

    if (this.active && this.active.isReady()) {
      this.questions.splice(this.questions.indexOf(this.active), 1)
      this.active = this.questions.shift();
    }

  }
  endTalk(msg){
    //TODO: save talk to DB
    //TODO: notify admin
    this.onEnd(msg)
  }

  buildMarkup() {
    let replyMarkup;
    let {type} = this.active;
    if (type === 'inlineKeyboard') {
      replyMarkup = bot.inlineKeyboard([this.active.answers.map(buildButton)]);
    }
    return replyMarkup
  }

  setAnswer(msg) {
    //TODO assert
    this.active.setAnswer(msg.data)
  }

  matchAnswer() {
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
  constructor(text, optoins) {
    this.text = text;
    this.type = optoins.type;
    this.answer = null;
    this.answers = optoins.answers;
    this.singleUse = false;
    this.ready = false
  }

  isReady() {
    return this.ready
  }

  setAnswer(answer) {
    //TODO: validation if not came from callback
    this.answer = answer;
    this.ready = true;
  }

}


function buildButton(answer) {
  //TODO: validate answer;
  return bot.inlineButton(answer.text, {callback: answer.callback})
}

module.exports = {
  Talk, Question
};