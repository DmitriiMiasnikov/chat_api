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
      let messages = await Messages.find({ chat_id: chatId }).sort({ date: -1 }).skip(page * 30 - 30).limit(30);
      messages = messages.reverse()
      res.status(200).json({ messages })
    } catch (e) {
      console.log(e)
    }
  }
)

// создать новое сообщение
// /mesages/
router.post(
  '/',
  async (req, res) => {
    try {
      const text = req.query.text;
      const userId = req.query.userId;
      const chatId = req.query.chatId;
      const user = await Users.findOne({ _id: userId }, 'userName')
      const userName = user.userName;
      const message = new Messages({
        text: text,
        user_id: userId,
        userName: userName,
        chat_id: chatId,
        date: Date()
      })
      await message.save();
      res.status(200).json({ message })
    } catch (e) {
      console.log(e)
    }
  }
)

// удалить сообщение
// /messages/:id
router.delete(
  '/:messageId',
  async (req, res) => {
    try {
      const messageId = req.params.messageId;
      const message = await Messages.findByIdAndDelete(messageId);
      res.status(200).json({ message })
    } catch (e) {
      console.log(e)
    }
  }
)

// редактировать текст
// /messages//:messageId
router.put(
  '/:messageId',
  async (req, res) => {
    try {
      const messageId = req.params.messageId;
      const text = req.query.text;
      const message = await Messages.findByIdAndUpdate(messageId, { text: text });
      res.status(200).json({ message })
    } catch (e) {
      console.log(e)
    }
  }
)

module.exports = router;