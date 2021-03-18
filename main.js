const express = require('express');
const google = require('googleapis').google;
const jwt = require('jsonwebtoken');
const db = require('./queries.js')

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
    scope: CONFIG.oauth2Credentials.scopes,
  })
  return res.render("index", { loginLink: loginLink })
})

app.get('/auth_callback', (req, res) => {
  const oauth2Client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0] 
  )
  if (req.query.error) {
    return res.redirect('/')
  } else {
    oauth2Client.getToken(req.query.code, (err, token) => {
      if (err) {
        return res.redirect('/')
      }
      res.cookie('jwt', jwt.sign(token, CONFIG.JWTsecret))
      return res.redirect('/youtube')
    })
  }
})

app.get('/youtube', (req, res) => {
  if (!req.cookies.jwt) {
    return res.redirect('/')
  }
  const oauth2Client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0] 
  )
  oauth2Client.credentials = jwt.verify(req.cookies.jwt, CONFIG.JWTsecret)
  const service = google.youtube('v3')
  service.subscriptions.list({
    auth: oauth2Client,
    mine: true,
    part: 'snippet,contentDetails',
    maxResults: 5,
  }).then(response => {
    return res.render('data', { subscriptions: response.data.items })
  })
})

app.get('/:id', (req, res) => {
  if (!req.cookies.jwt) {
    return res.redirect('/')
  }
  const oauth2Client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0] 
  )
  oauth2Client.credentials = jwt.verify(req.cookies.jwt, CONFIG.JWTsecret)
  res.send(req.params)
})