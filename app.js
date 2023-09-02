// require("dotenv").config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

const User = require("./model/user");
const sequelize = require("./utils/database");
const app = express();

app.use(bodyParser.json());
app.use(cors());

// app.get("/user/signup", (req, res) => {
//   res.status(200).json({ success: true });
// });

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
