const mongoose = require('mongoose')
const sessionSchema = new mongoose.Schema({
  user: {
    name: String,
    id: Number
  },
  chat_id: String,
  questions: mongoose.Schema.Types.Mixed
});

mongoose.model('Session', sessionSchema);