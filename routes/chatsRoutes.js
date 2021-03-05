const { Router } = require('express');
const sha256 = require('js-sha256');
const Users = require('./../models/Users');
const Chats = require('./../models/Chats');
const router = Router();

// инфа о пользователе
// /chats/all/
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

module.exports = router;