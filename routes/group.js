const express = require("express");
const Authent = require("../utils/auth");
const grpController = require("../controllers/group");
const app = express.Router();

app.post("/createGrp", Authent.Authenticate, grpController.createGroup);
app.get("/getGroup", Authent.Authenticate, grpController.getGroup);
app.post("/joinGroup", Authent.Authenticate, grpController.joinGroup);
app.delete("/deleteUser", Authent.Authenticate, grpController.deleteUser);
app.put("/makeAdmin", Authent.Authenticate, grpController.makeAdmin);
app.post("/joinGroup/:grpId", Authent.Authenticate, grpController.addParticant);

module.exports = app;
