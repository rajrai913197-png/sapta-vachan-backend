const express = require("express");

const {
  sendMessage,
  getMessages,
} = require("../controller/messageController");

const routerMsg = express.Router();

routerMsg.post("/sendMessage", sendMessage);

routerMsg.get(
  "/messages/:user1/:user2",
  getMessages
);

module.exports = routerMsg;