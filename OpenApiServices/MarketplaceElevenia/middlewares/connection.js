exports.mongodb = function () {
    
const db = require("../models");
const dbConfig = require("../config/db.config");

db.mongoose
  .connect(`mongodb://'${dbConfig.USERNAME}':'${dbConfig.PASSWORD}'@' ${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    // console.log("Successfully connect to MongoDB.");
    // ===================================== JWT MODULE - ADMIN ROLE

    // ===================================== JWT MODULE - ADMIN ROLE
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
}