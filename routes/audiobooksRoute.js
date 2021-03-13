'use strict';
const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;

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

/* GET /audiobooks
   ============================= */
router.get('/', (req, res) => {
  db.collection('audiobooks')
    .find()
    .toArray()
    .then((data) => {
      res.json({
        status: 200,
        data,
        message: 'audiobooks retrieved successfully',
      });
    })
    .catch((error) => console.error(error));
});
/* GET /audiobooks/:audiobookID
   ============================= */
router.get('/:audiobookID', (req, res) => {
  let audiobookID;
  try {
    console.log(req.params.audiobookID);
    audiobookID = new ObjectID(req.params.audiobookID);
  } catch (err) {
    return res.status(400).json({
      message: 'Invalid audiobookID',
    });
  }
  db.collection('audiobooks')
    .findOne({ _id: audiobookID })
    .then((data) => {
      res.json({
        status: 200,
        data,
        message: 'audiobook #' + audiobookID + ' retrieved successfully',
      });
    })
    .catch((error) => console.error(error));
});

module.exports = router;
