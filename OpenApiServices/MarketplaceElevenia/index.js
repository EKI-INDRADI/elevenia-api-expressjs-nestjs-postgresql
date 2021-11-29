const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  console.log('event: ', event);
  console.log('context: ', context);

  // Remove the stage
  if ('stage' in event.requestContext && event.requestContext['stage'] !== undefined) {
    let defaultPath = process.env.DEFAULT_PATH || '/tokopedia'
    event.path = event.path.replace(defaultPath, '');
  }

  awsServerlessExpress.proxy(server, event, context);
};
