// require("dotenv").config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("./model/user");
const sequelize = require("./utils/database");
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
