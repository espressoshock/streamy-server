'use strict';
const express = require('express');
const router = express.Router();

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
module.exports = router;
