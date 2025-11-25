const serverless = require('serverless-http');
const app = require('../index'); // path to your main server.js

module.exports = serverless(app);
