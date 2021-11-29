require('dotenv').config();


module.exports = {
  HOST: (process.env.MODE == 'LIVE') ?  process.env.LIVE_HOST : process.env.TEST_HOST,
  API_KEY: (process.env.MODE == 'LIVE') ? process.env.LIVE_API_KEY :  process.env.TEST_API_KEY
}




