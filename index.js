require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
// https://test-project-65605.web.app
app.use(
  cors({
    origin: 'https://test-project-65605.web.app',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  })
);

const db = require('./queries');

// configure firebase admin sdk
const serviceAccount = require('./config/firebase-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// AUTHENTICATION MIDDLEWARE

const isAuthenticated = async (req, res, next) => {
  // retrieve authorization token from http header

  const authHeader = req.headers.authorization || req.headers.authorization2;
  if (authHeader) {
    let idToken;
    if (req.headers.authorization) {
      idToken = authHeader.split(' ')[1];
    } else {
      idToken = authHeader;
    }


    // verify token
    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        req.body.uid = decodedToken.uid;
        req.body.email = decodedToken.email;
        // ...
      })
      .catch((error) => {
        // Handle error
        req.body.uid = null;
        res.send({ error: 'error in verifying token' });
      });

  }
  return next();
};

// PROTECTED ROUTES
app.get('/api/test', isAuthenticated, (req, res) => {
  if (req.body.uid) {
    res.end('authenticated');
  } else {
    res.end('not authenticated');
  }
});

// ROUTES

app.post(
  '/api/user',
  isAuthenticated,
  (req, res, next) => {
    // if the user is authenticated, they must be signed out first before creating a user
    if (req.body.uid) {
      res.send({ error: 'cannot register user while signed in' });
    } else {
      next();
    }
  },
  db.addUser
);

app.get(
  '/api/user',
  isAuthenticated,
  (req, res, next) => {
    // if the user is not authenticated do not fetch user data
    if (!req.body.uid) {
      res.end();
    } else {
      next();
    }
  },
  db.getUser
);

app.post(
  '/api/post',
  isAuthenticated,
  (req, res, next) => {
    if (!req.body.uid) {
      res.send({ error: 'must be logged in to make a post' });
    } else {
      next();
    }
  },
  db.addPost
);

app.get(
  '/api/post',
  db.getPosts
);

app.listen(process.env.PORT || PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
