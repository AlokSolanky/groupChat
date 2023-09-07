const express = require("express");
const chatController = require("../controllers/chat");

const Authent = require("../utils/auth");

const app = express.Router();

app.get("/getChat", chatController.getChat);
app.post("/sendChat", Authent.Authenticate, chatController.sendChat);

module.exports = app;
