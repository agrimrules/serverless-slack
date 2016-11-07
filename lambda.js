'use strict';
const awsSererlessExpress = require('aws-serverless-express'),
    app = require('./app'),
    server = awsSererlessExpress.createServer(app);
exports.handler=(event, context) => {
    console.log("Incoming event"+event);
    awsSererlessExpress.proxy(server, event, context);
  }
