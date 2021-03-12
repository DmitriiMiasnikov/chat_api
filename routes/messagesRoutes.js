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
        let userName;
        if (item.user_id === 'anonim') {
          userName = 'Аноним'
        } else {
          const user = await Users.findOne({ _id: item.user_id }, 'userName')
          userName = user.userName;
        }
        const newItem = {
          userName: userName,
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

// создать новое сообщение
// /mesages/
router.post(
  '/',
  async (req, res) => {
    try {
      const text = req.query.text;
      const userId = req.query.userId;
      const chatId = req.query.chatId;
      const message = new Messages({
        text: text,
        user_id: userId,
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