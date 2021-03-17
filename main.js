const express = require('express');
const google = require('googleapis').google;
const jwt = require('jsonwebtoken');

// Google's OAuth2 client
const OAuth2 = google.auth.OAuth2;

// Including our config file
const CONFIG = require('./config');

// Creating our express application
const app = express();

// Allowing ourselves to use cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Setting up EJS Views
app.set('view engine', 'ejs');
app.set('views', __dirname);

// Listen on the port defined in the config file
app.listen(CONFIG.port, () => {
  console.log(`Listening on port ${CONFIG.port}`);
});

app.get('/', (req, res) => {
  const oauth2Client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0] 
  )

  const loginLink = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scopes: CONFIG.oauth2Credentials.scopes
  })
})