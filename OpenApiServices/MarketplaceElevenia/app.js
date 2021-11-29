let express = require('express');
let logger = require('morgan');
let app = express();

// // ============= SECURITY CORS
// let header_middleware = require("./middlewares/headers"); // 27-09-2021
// app.use(header_middleware);
// // ============= SECURITY CORS

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// ===================================== DIR
let path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
global.__basedir = __dirname;
// ===================================== / DIR

app.use('/status', (req, res) => {
  res.json({ statusCode: 1, message : 'API IS OK!' });
});



// ============= SECURITY JWT
// let tokenJwt_middleware = require("./middlewares/tokenJwt"); // 27-09-2021
// tokenJwt_middleware.tokenJwt(app);
// ============= /SECURITY JWT


let elevenia_route = require('./routes/elevenia.routes') 
app.use('/elevenia/', elevenia_route);  

app.use('/check-token', (req, res) => {
  res.json({ statusCode: 1, message : 'JWT ENABLE' });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({statusCode : 0, message : err.message})
});


const PORT = process.env.PORT;
app.listen(PORT, (req, res) => {
console.log(`Server is running on port ${PORT}.`);
  // console.log(` Application running on port : ${PORT}  - [PID : ${process.pid}]`);
});


// module.exports = app;
