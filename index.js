const express = require('express');
const audiobookRoute = express.Router();
const multer = require('multer');

const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const { Readable } = require('stream');

const app = express();
app.use('/audiobooks', audiobookRoute);

/* mongodb
   ============================= */
let db;
MongoClient.connect('mongodb://localhost/streamyDB', (err, database) => {
  if (err) {
    console.log(
      'MongoDB Connection Error. Please make sure that MongoDB is running.'
    );
    process.exit(1);
  }
  db = database;
});
