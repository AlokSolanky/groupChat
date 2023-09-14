const Sequelize = require(`sequelize`);
const sequelize = require(`../utils/database`);
const ArchivedChat = sequelize.define(`archivedchats`, {
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

module.exports = ArchivedChat;
