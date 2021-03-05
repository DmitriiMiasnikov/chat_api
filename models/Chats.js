const { Schema, model } = require('mongoose');

const schema = new Schema({
  date: { 
    type: Date, 
    default: Date.now 
  },
  user_id: {
    type: String,
    required: true
  },
})

module.exports = model('Chats', schema);