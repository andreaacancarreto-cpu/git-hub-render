require('dotenv').config();

// reemplaza al config.json que crea sequelize-cli init
// asi la contraseña no queda en el codigo, se lee del .env

// la bd de render pide ssl si te conectas desde afuera (desde la compu)
// dentro de render no hace falta, por eso DB_SSL=false
const ssl = process.env.DB_SSL === 'true'
  ? { ssl: { require: true, rejectUnauthorized: false } }
  : {};

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: false,
  dialectOptions: ssl,
};

// se usa la misma configuracion en local y en render
module.exports = {
  development: base,
  production: base,
};