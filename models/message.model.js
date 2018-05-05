const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
  user: {
    name: String,
    id: Number
  },
  message: {
    chat_id: String,
    id: String,
    text: String
  },
  timestamp: Number
});

mongoose.model('Message', messageSchema);