const User = require("../model/user");
const Group = require("../model/group");
const GroupUser = require("../model/usergroup");

module.exports.createGroup = async (req, res) => {
  if (!req.body.grp) res.status(404).json({ success: false });
  else {
    Group.create({ groupName: req.body.grp })
      .then((result) => {
        result.addUser(req.user.id, { through: { isAdmin: true } });
        res
          .status(200)
          .json({ success: true, msg: "Group created Successfully", result });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
};

module.exports.getGroup = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      res
        .status(400)
        .json({ success: false, result: null, msg: "no user logged in" });
    }
    const groups = await user.getGroups();
    if (!groups) {
      res.status(400).json({
        success: false,
        result: null,
        msg: "no groups created by this user",
      });
    }
    res
      .status(200)
      .json({ success: true, result: groups, msg: "Groups found" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, result: err, msg: "internal server error" });
  }
};

module.exports.joinGroup = async (req, res) => {
  if (!req.body.grpId) res.status(404).json({ success: false });
  else {
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
};

module.exports.deleteUser = async (req, res) => {
  try {
    let userId = req.query.userId - 0;
    let grpId = req.query.grpId - 0;

    // console.log(userId, " and ", grpId);
    if (!(userId === req.user.id)) {
      const user = await User.findByPk(userId);
      const group = await Group.findByPk(grpId);
      let result = await user.removeGroup(group);
      if (result) {
        res.status(200).json({
          success: true,
          result,
          message: "User deleted successfully",
        });
      }
    } else {
      res.status(200).json({
        success: false,
        result: null,
        message: "You are not an admin of this group",
      });
    }
  } catch (error) {}
};

module.exports.addParticant = async (req, res) => {
  let grpId = req.params.grpId - 0;
  if (!grpId) res.status(404).json({ success: false });
  else {
    try {
      const userGroup = await GroupUser.findOne({
        where: {
          userId: req.user.id,
          groupId: grpId,
          isAdmin: true, // Check if the user is an admin
        },
      });
      if (userGroup) {
        let result = await Group.findByPk(grpId);
        if (result) {
          let user = await User.findByPk(req.body.userId);
          if (user) {
            result.addUser(user);
            res
              .status(200)
              .json({ success: true, msg: "Joined Successfully", result });
          } else {
            res.status(404).json({
              success: false,
              msg: "no user found with this id",
              result: null,
            });
          }
        } else {
          res
            .status(400)
            .json({ success: false, msg: "no such group found", result });
        }
      } else {
        res
          .status(200)
          .json({ success: false, msg: "you are not an admin", result: null });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).json(err);
    }
  }
};

module.exports.makeAdmin = async (req, res) => {
  try {
    let userId = req.query.userId - 0;
    let grpId = req.query.grpId - 0;

    if (!(userId === req.user.id)) {
      const user = await User.findByPk(userId);
      const group = await Group.findByPk(grpId);
      if (!user || !group) {
        res.status(400).json({ msg: "No group or no User found" });
      }
      let result = await group.addUser(user, { through: { isAdmin: true } });
      if (result) {
        res.status(200).json({
          success: true,
          result,
          message: "User is now Admin",
        });
      }
    } else {
      res.status(200).json({
        success: false,
        result: null,
        message: "You are not an admin of this group",
      });
    }
  } catch (error) {
    res.json({ error });
  }
};
