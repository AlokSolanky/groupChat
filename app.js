// require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./model/user");
const Chat = require("./model/chat");
const Group = require("./model/group");
const GroupUser = require("./model/usergroup");
const sequelize = require("./utils/database");
const Authent = require("./utils/auth");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const grpRoutes = require("./routes/group");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRoutes);

app.use("/chat", chatRoutes);

app.use("/grp", grpRoutes);

io.on("connection", (socket) => {
  socket.on("sendData", (obj) => {
    socket.broadcast.emit("recieve-all", obj);
  });
});

User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.belongsToMany(Group, { through: GroupUser });
Group.belongsToMany(User, { through: GroupUser });

sequelize
  .sync()
  .then(() => {
    console.log("Database Connected...");
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`Server start on port 3000`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
