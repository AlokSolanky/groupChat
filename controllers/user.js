const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Group = require("../model/group");
const User = require("../model/user");

function generateWebToken(id) {
  return jwt.sign(
    { userId: id },
    "ljalgmklgjal20359ijfljo209jlkjalkvjaijsaoijwg"
  );
}

module.exports.getUser = async (req, res) => {
  try {
    let grpId = req.query.grpId - 0;
    const group = await Group.findByPk(grpId);
    const result = await group.getUsers();
    if (result) {
      res.status(200).json({ result, success: true, admin: group.userId });
    } else {
      res.status(200).json({ result: null, success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

module.exports.getLoginUser = async (req, res) => {
  res.status(200).json({ name: req.user.name });
};

module.exports.signinUser = (req, res) => {
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
};

module.exports.signupUser = (req, res) => {
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
};
