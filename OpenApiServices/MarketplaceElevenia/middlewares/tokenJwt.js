const jwt = require('jsonwebtoken'); // we're using 'express-session' as 'session' here

//===========undefined findOne gara2 ga ada model
// var mongoose = require('mongoose');
// const db = require('../mongodb');
// const user_account_model = db['user_account']
//===========undefined findOne gara2 ga ada model


const db = require("../models");
const user_account = db.user_account;

let configAuth = require('./config/authJwt');



exports.tokenJwt = function (app) {
  app.use((req, res, next) => {

    //=========28-09-2021
    // let callback_token = (req.headers['x-callback-token']) ? req.headers['x-callback-token'] : 'missing_callback' //req.header('x-callback-token')
    // let callback_token_verify = null
    // if (process.env.XENDIT_VIRTUAL_ACCOUNT = 'test') {
    //   callback_token_verify = process.env.XENDIT_CALLBACK_TOKEN_TEST
    // } else if (process.env.XENDIT_VIRTUAL_ACCOUNT = 'live') {
    //   callback_token_verify = process.env.XENDIT_CALLBACK_TOKEN_LIVE
    // }
    //=========/28-09-2021

    const token = req.headers['x-access-token']

    // if (callback_token == callback_token_verify) {
    //   //=========28-09-2021

    //   next();

    //   //=========/28-09-2021
    // } else 
    if (token) {
      jwt.verify(token, configAuth.secret, function (err, decoded) {
        if (!err) {
          // req.decoded = decoded;

          //===================== DISABLE JIKA INGIN MULTI USER
          user_account.findOne({ token: token }, (err, result) => {
            if (err) {
              res.json({ statusCode: 0, error: err });
              return;
            }
            if (result) {
              //===================== /DISABLE JIKA INGIN MULTI USER

              next();

              //===================== DISABLE JIKA INGIN MULTI USER
            } else {
              res.json({ statusCode: 'Token invalid!' });
            }
          });
          //===================== /DISABLE JIKA INGIN MULTI USER

          next();

        } else {
          res.json({ statusCode: 'Token invalid!' });
        }
      });
    } else {
      res.json({ statusCode: 'No token provided!' });
    }


  });
};;















// (req, res, next) => {
//     // check for token in the header first, then if not provided, it checks whether it's supplied in the body of the request
//     // console.log(req.headers['x-access-token']);
//     // console.log(req.body);
//     const token = req.headers['x-access-token'] || req.body.token;
//     // console.log("token: ", token);
//     if (token) {
//       // console.log(token, '=====================token================');
//       jwt.verify(token, token_secret, function (err, decoded) {
//         if (!err) {
//           req.decoded = decoded; // this add the decoded payload to the client req (request) object and make it available in the routes
//           user_account.findOne({ token: token }, (err, result) => {
//             if (err) {
//               res.json({ statusCode: 0, error: err });
//               return;
//             }
//             if (result) {
//               // console.log(result, '====================== result ==================');
//               next();
//             } else {
//               // console.log;('Token invalid!-1');
//               res.json({ statusCode: 'Token invalid!' });
//             }
//           });
//         } else {
//           // console.log('Token invalid!-2');
//           res.json({ statusCode: 'Token invalid!' });
//         }
//       });
//     } else {
//       // console.log(req.headers);
//       console.log('No token provided!');
//       res.json({ statusCode: 'No token provided!' });
//     }
//   }