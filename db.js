const assert = require('assert');
const mongoose = require('mongoose');
const Session = require('./models/session.model');
const Message = require('./models/message.model');
const Event = require('./models/event.model');

assert.notEqual(process.env.MONGODB_URL, undefined);

const dbName = 'aeroyoga';

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // eslint-disable-next-line no-console
  console.log("we're connected!");
});
