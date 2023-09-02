const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const User = require("./model/user");
const app = express();

// app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors);

app.post("/user/signup/", (req, res) => {
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

app.listen(3000, () => {
  console.log("listening");
});
