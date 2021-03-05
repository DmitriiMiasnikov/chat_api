const { Router } = require('express');
const sha256 = require('js-sha256');
const Users = require('./../models/Users');
const Chats = require('./../models/Chats');
const router = Router();

// список чатов
// /chats/list/
router.get(
  '/list/:page',
  async (req, res) => {
    try {
      const page = Number(req.params.page);
      const chats = await Chats.find({}).skip(page * 30 - 30).limit(30);
      res.status(200).json({ chats })
    } catch (e) {
      console.log(e)
    }
  }
)

// получить чат по Id
// /chats/id/:chatId
router.get(
  '/id/:chatId',
  async (req, res) => {
    try {
      const chatId = req.params.chatId;
      const chat = await Chats.findOne({ _id: chatId });
      res.status(200).json({ chat })
    } catch (e) {
      console.log(e)
    }
  }
)

// создать новый чат
// /chats/create/
router.post(
  '/create/',
  async (req, res) => {
    try {
      const chatTitle = req.query.chatTitle;
      const userId = req.query.userId;
      const chat = new Chats({
        title: chatTitle,
        user_id: userId
      })
      await chat.save();
      res.status(200).json({ chat })
    } catch (e) {
      console.log(e)
    }
  }
)

module.exports = router;