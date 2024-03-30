import { Sequelize } from 'sequelize-typescript';

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
const SequelizeDB = new Sequelize({
  database: DB_NAME,
  dialect: 'mysql',
  port: 3306,
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASSWORD,
  models: [],
});

export default SequelizeDB;
