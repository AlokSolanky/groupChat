const express = require("express");
const userController = require("../controllers/user");
const Authent = require("../utils/auth");

const app = express.Router();

app.get("/getUser", userController.getUser);
app.get("/getLoginUser", Authent.Authenticate, userController.getLoginUser);
app.post("/signin", userController.signinUser);
app.post("/signup", userController.signupUser);

module.exports = app;
