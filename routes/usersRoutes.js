const { Router } = require("express");
const sha256 = require("js-sha256");
const validator = require("email-validator");
const Users = require("./../models/Users");
const Chats = require("../models/Chats");
const Messages = require("./../models/Messages");
const router = Router();

// регистрация нового пользователя
// /users/registration
router.post("/registration", async (req, res) => {
  const userName = req.query.userName;
  const password = req.query.password;
  const email = req.query.email;
  let err = { state: false, message: [] };
  let user;
  if (userName.length < 4) {
    err.state = true;
    err.message.push("имя минимум 4 символа");
  }
  if (password.length < 6 || password.length > 24) {
    err.state = true;
    err.message.push("пароль от 6 до 24 символов");
  }
  if (!validator.validate(email)) {
    err.state = true;
    err.message.push("некорректный адрес почты");
  }
  if (!err.state) {
    user = new Users({
      userName: req.query.userName,
      password: sha256(req.query.password),
      email: req.query.email,
    });
    await user.save();
  }
  res.status(200).json({ user, err, isAuth: !err.state });
});

// авторизация пользователя
// /users/authorization
router.get("/authorization", async (req, res) => {
  try {
    const userName = req.query.userName;
    const password = req.query.password;
    let err = { state: false, message: [] };
    const user = await Users.findOne(
      { userName: userName, password: sha256(password) },
      "_id userName email"
    );
    if (!user) {
      err.state = true;
      err.message.push("неверное имя или пароль");
    }
    res.status(200).json({ user, isAuth: !err.state || Boolean(user) });
  } catch (e) {
    console.log(e);
  }
});

// инфа о пользователе
// /users/id/:id
router.get("/id/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findOne({ _id: id }, "_id userName email");
    const userChats = await Chats.find({ user_id: id });
    const userMessages = await Messages.find({ user_id: id });
    res.status(200).json({ user, userChats, userMessages });
  } catch (e) {
    console.log(e);
  }
});

// список пользователей
// /users/list/:page
router.get("/list/:page", async (req, res) => {
  try {
    const page = Number(req.params.page);
    const usersList = await Users.find({}, "_id userName email")
      .skip(page * 30 - 30)
      .limit(30);
    const users = [];
    for (const item of usersList) {
      const userChatsCount = await Chats.find({
        user_id: item._id,
      }).countDocuments();
      const userMessagesCount = await Messages.find({
        user_id: item._id,
      }).countDocuments();
      const newItem = {
        id: item._id,
        email: item.email,
        userName: item.userName,
        chatsCount: userChatsCount,
        messagesCount: userMessagesCount,
      };
      users.push(newItem);
    }
    res.status(200).json({ users });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
