const {bot} = require('./index');
const ADMIN_ID = process.env.ADMIN_ID;
//TODO: expire state

class Talk {

  constructor(questions, options = {}) {
    this.questions = questions;
    this.resolvedQuestions = [];
    this.active = this.questions && this.questions.length ? this.questions[0] : null;
    this.onEnd = options.callback || ((msg) => {
      const result = this.resolvedQuestions.map(q =>  q.answer).join(' ');
      bot.sendMessage(msg.from.id, `(Demo)Вы записались ${result}`);
      bot.sendMessage(ADMIN_ID, `Новая запись ${msg.from.last_name} ${msg.from.first_name} ${result}`);
    })
  }

  async reply(msg) {
    let replyMarkup;
    this.nextQuestion();

    if (!this.active){
      return this.endTalk(msg);
    }

    // TODO: support requesting contact question
    replyMarkup = await this.buildMarkup();

    return bot.sendMessage(msg.from.id, this.active.text, {replyMarkup});
  }

  nextQuestion() {

    if (this.active && !this.active.isReady()) {
      return this.active;
    }

    if (this.active && this.active.isReady()) {
      const resolvedQuestion = this.questions.splice(this.questions.indexOf(this.active), 1);
      this.resolvedQuestions.push(resolvedQuestion[0]);
      this.active = this.questions.length ? this.questions[0] : null;
    }

  }
  endTalk(msg){
    //TODO: save talk to DB
    //TODO: notify admin
    this.onEnd(msg)
  }

  async buildMarkup() {
    let replyMarkup;
    let {type} = this.active;
    if (type === 'inlineKeyboard') {
      let answers = [];

      if (this.active.filter !== undefined && typeof this.active.filter === 'function') {
        answers = await this.active.filter(this.resolvedQuestions).catch(e => {
          console.log(e)
          return [];
        })
      } else {
         answers = await this.active.answers;
      }
      replyMarkup = bot.inlineKeyboard(listToMatrix(answers.map(buildButton), 3));
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
    this.key = optoins.key;
    this.type = optoins.type;
    this.answer = null;
    this.answers = optoins.answers;
    this.filter = optoins.filterAnswers;
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


function listToMatrix(list, elementsPerSubArray) {
  let matrix = [], i, k;

  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(list[i]);
  }

  return matrix;
}
