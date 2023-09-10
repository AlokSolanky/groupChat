const Chat = require("../model/chat");
const User = require("../model/user");
const { Op } = require("@sequelize/core");
module.exports.getChat = async (req, res) => {
  try {
    let msgid = req.query.msgId;
    let grpid = req.query.grpId;
    msgid = msgid - 0;
    grpid = grpid - 0;
    const result = await Chat.findAll({
      where: {
        id: {
          [Op.gt]: msgid,
        },
        groupId: grpid,
      },
      include: User,
    });
    if (result) {
      res.status(200).json({ result, success: true });
    } else {
      res.status(200).json({ result: null, success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};

module.exports.sendChat = async (req, res) => {
  console.log("THIS IS FILE ", req.body.fileToSend);
  try {
    let result = await Chat.create({
      msg: req.body.msgToSend,
      userId: req.user.id,
      groupId: req.body.grpId,
    });
    res.status(200).json({ success: true, result, userName: req.user.name });
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
};
