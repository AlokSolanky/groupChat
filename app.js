// require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("@sequelize/core");

const User = require("./model/user");
const Chat = require("./model/chat");
const Group = require("./model/group");
const sequelize = require("./utils/database");
const Authent = require("./utils/auth");
const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);

function generateWebToken(id) {
  return jwt.sign(
    { userId: id },
    "ljalgmklgjal20359ijfljo209jlkjalkvjaijsaoijwg"
  );
}

app.post("/user/signup", (req, res) => {
  try {
    User.findAll({ where: { email: req.body.email } }).then(([result]) => {
      if (!result) {
        bcrypt.hash(req.body.password, 10, async (err, hash) => {
          await User.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
          });
          res.json({ result: "user created succesfully" });
        });
      } else {
        res.json({ result: "user already registered" });
      }
    });
  } catch (err) {
    res.json({ result: err });
  }
});

app.post("/user/signin", (req, res) => {
  User.findAll({ where: { email: req.body.email } })
    .then(([result]) => {
      if (result) {
        bcrypt.compare(req.body.password, result.password, (err, response) => {
          if (err) {
            res.status(500).json({ result: "Error" });
          }
          if (response) {
            res.status(200).json({
              result: "login successfully",
              success: true,
              token: generateWebToken(result.id),
            });
          } else {
            res
              .status(200)
              .json({ result: "password incorrect", success: false });
          }
        });
      } else {
        res.status(200).json({ result: "Not registered, Sign Up first" });
      }
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
});

app.get("/user/getUser", async (req, res) => {
  try {
    let result = await User.findAll();
    if (result) {
      res.status(200).json({ result, success: true });
    } else {
      res.status(200).json({ result: null, success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
});

app.post("/chat/sendchat", Authent.Authenticate, async (req, res) => {
  try {
    let result = await Chat.create({
      msg: req.body.msgToSend,
      userId: req.user.id,
      groupId: req.body.grpId,
    });
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
});

app.get("/chat/getChat", async (req, res) => {
  try {
    let msgid = req.query.msgId;
    let grpid = req.query.grpId;
    msgid = msgid - 0;
    grpid = grpid - 0;
    console.log("group id ", grpid);
    const result = await Chat.findAll({
      where: {
        id: {
          [Op.gt]: msgid,
        },
        groupId: grpid,
      },
    });
    if (result) {
      res.status(200).json({ result, success: true });
    } else {
      res.status(200).json({ result: null, success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
});

app.post("/grp/createGrp", Authent.Authenticate, async (req, res) => {
  if (!req.body.grp) res.status(404).json({ success: false });
  else {
    Group.create({ groupName: req.body.grp, userId: req.user.id })
      .then((result) => {
        result.addUser(req.user);
        res
          .status(200)
          .json({ success: true, msg: "Group created Successfully", result });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
});

app.get("/grp/getGroup", Authent.Authenticate, async (req, res) => {
  Group.findAll({ where: { userId: req.user.id } })
    .then((result) => {
      res.status(200).json({ success: true, result });
    })
    .catch((err) => {
      res.status(400).json({ success: false, err });
    });
  //   const userId = req.user.id;

  //   try {
  //     console.log("reached1");
  //     const user = await User.findByPk(userId, {
  //       include: [
  //         {
  //           model: Group,
  //           through: "User_Group",
  //         },
  //       ],
  //     });
  //     console.log("reached2");
  //     if (user) {
  //       const groups = user.Groups;
  //       res.json({ userId, groups });
  //     } else {
  //       res.status(404).json({ error: "User not found" });
  //     }
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
});

app.post("/grp/joinGroup", Authent.Authenticate, async (req, res) => {
  if (!req.body.grpId) res.status(404).json({ success: false });
  else {
    console.log("GRP ID ", req.body.grpId);
    try {
      let result = await Group.findByPk(req.body.grpId);
      if (result) {
        result.addUser(req.user);
        res
          .status(200)
          .json({ success: true, msg: "Joined Successfully", result });
      } else {
        res
          .status(400)
          .json({ success: false, msg: "no such group found", result });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

User.hasMany(Chat);
Chat.belongsTo(User);

User.hasOne(Group);
Group.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.belongsToMany(Group, { through: "User_Group" });
Group.belongsToMany(User, { through: "User_Group" });

sequelize
  .sync()
  .then(() => {
    console.log("Database Connected...");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server start on port 3000`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
