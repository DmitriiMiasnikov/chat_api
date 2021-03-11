const { Router } = require('express');
const sha256 = require('js-sha256');
const Users = require('./../models/Users');
const Chats = require('./../models/Chats');
const Messages = require('./../models/Messages');
const router = Router();

// список сообщений
// /messages/list/
router.get(
  '/list/:page',
  async (req, res) => {
    try {
      const page = Number(req.params.page);
      const chatId = req.query.chatId;
      const messagesList = await Messages.find({ chat_id: chatId }).skip(page * 30 - 30).limit(30);
      const messages = [];
      for (const item of messagesList) {
        const user = await Users.findOne({ _id: item.user_id }, 'userName')
        const newItem = {
          userName: user.userName,
          text: item.text,
          date: item.date,
          id: item._id
        };
        messages.push(newItem);
      }
      res.status(200).json({ messages })
    } catch (e) {
      console.log(e)
    }
  }
)

module.exports = router;