const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
  user: {
    name: String,
    id: Number
  },
  chat_id: [String],
  timestamp: Number
});

mongoose.model('Message', messageSchema);