setupHeaders = (req, res, next) => {

  res.setHeader('Access-Control-Allow-Origin', process.env.SETTING_CORS); //process.env.SETTING_CORS // '*' // 'http://127.0.0.1:3000' // 'https://api.product.prieds.com'

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,responseType,x-access-token,new-access-token'
  );

  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
}

module.exports = setupHeaders;