
  require('dotenv').config();
  
  module.exports = {
    DB_HOST: process.env.HOST,
    DB_PORT:  process.env.PORT ,
    DB: process.env.DB,
    USERNAME : process.env.DB_USERNAME,
    PASSWORD : process.env.DB_PASSWORD
  };