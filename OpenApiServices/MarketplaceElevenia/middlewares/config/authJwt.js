require('dotenv').config();

module.exports = {
  secret: String(process.env.JWT_SECRET_KEY)
};
