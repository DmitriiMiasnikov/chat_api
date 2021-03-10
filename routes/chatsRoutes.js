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
      const chatsList = await Chats.find({}).skip(page * 30 - 30).limit(30);
      const chats = [];
      for (const item of chatsList) {
        const user = await Users.findOne({ _id: item.user_id }, 'userName')
        const newItem = {
          userName: user.userName,
          title: item.title,
          date: item.date,
          id: item._id
        };
        chats.push(newItem);
      }
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

// удалить чат
// /chats/remove/
router.get(
  '/remove/',
  async (req, res) => {
    try {
      const chatId = req.query.chatId;
      const chat = await Chats.findByIdAndDelete(chatId);
      res.status(200).json({ chat })
    } catch (e) {
      console.log(e)
    }
  }
)

// изменить название
// /chats/rename
router.get(
  '/rename/',
  async (req, res) => {
    try {
      const chatId = req.query.chatId;
      const newTitle = req.query.newTitle;
      const chat = await Chats.findByIdAndUpdate(chatId, { title: newTitle });
      res.status(200).json({ chat })
    } catch (e) {
      console.log(e)
    }
  }
)

module.exports = router;