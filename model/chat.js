const Sequelize = require(`sequelize`);
const sequelize = require(`../utils/database`);
const Chat = sequelize.define(`chats`, {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  msg: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Chat;
