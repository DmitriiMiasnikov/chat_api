const { Schema, model } = require('mongoose');

const schema = new Schema({
  text: {
    type: String,
    required: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  chat_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
})

module.exports = model('Messages', schema);