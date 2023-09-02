const Sequelize = require(`sequelize`);
const sequelize = new Sequelize("chatapp", "root", "alok", {
  dialect: `mysql`,
  host: process.env.DB_HOST,
  // host: DB_HOST,
});
module.exports = sequelize;
