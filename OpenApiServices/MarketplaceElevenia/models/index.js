const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.user_account = require("./user.model")(mongoose);

module.exports = db;
