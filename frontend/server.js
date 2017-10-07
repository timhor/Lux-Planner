// server.js
const express = require('express');
const fallback = require('express-history-api-fallback');
const app = express();
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));
app.use(fallback(__dirname + '/dist/index.html'))
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);