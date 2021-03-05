const { Schema, model } = require('mongoose');

const schema = new Schema({
  date: { 
    type: Date, 
    default: Date.now 
  },
  title: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
})

module.exports = model('Chats', schema);