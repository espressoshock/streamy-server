'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Readable } = require('stream');
const ObjectID = require('mongodb').ObjectID;

const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const firebase = require('firebase-admin');

/* mongodb
   ============================= */
let db;
MongoClient.connect(
  'mongodb://localhost/streamyDB',
  {
    useUnifiedTopology: true,
  },
  (err, database) => {
    if (err) {
      console.log(
        'MongoDB Connection Error. Please make sure that MongoDB is running.'
      );
      process.exit(1);
    }
    db = database;
  }
);

/* POST /users
   ============================= */
router.post('/', (req, res) => {
  firebase.auth().createUser({
    email: req.body.email,
    password: req.body.password,
    displayName: req.body.username,
  });
  res.json({
    status: 200,
    message: 'user created successfully!',
  });
});

module.exports = router;
