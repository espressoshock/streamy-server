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
/* POST /audiobooks
   ============================= */
router.post('/', (req, res) => {
  const doc = {
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    genre: req.body.genre,
    language: req.body.language,
    coverImage: req.body.coverImage,
  };
  db.collection('audiobooks')
    .insertOne(doc)
    .then((resp) => {
      res.json({
        status: 200,
        data: doc,
        message: 'Success!' + resp,
      });
    })
    .catch((err) => {
      res.json({
        status: 400,
        data: doc,
        message: 'Error!' + err,
      });
    });
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
/* POST /audiobooks/:audiobookID/chapters
   ============================= */
router.post('/:audiobookID/chapters', (req, res) => {
  const doc = {
    title: req.body.title,
    reader: req.body.reader,
    duration: req.body.duration,
    index: req.body.index,
  };
  db.collection('chapters')
    .insertOne(doc)
    .then((resp) => {
      res.json({
        status: 200,
        data: doc,
        message: 'Success!' + resp,
      });
    })
    .catch((err) => {
      res.json({
        status: 400,
        data: doc,
        message: 'Error!' + err,
      });
    });
});

/* GET /audiobooks/:audiobookID/chapters
   ============================= */
router.get('/:audiobookID/chapters', (req, res) => {
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
      db.collection('chapters')
        .find({ audiobookID: audiobookID })
        .toArray()
        .then((chapters) => {
          res.json({
            status: 200,
            chapters,
            message:
              'chapter for audiobook #' +
              audiobookID +
              ' retrieved successfully',
          });
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
});

module.exports = router;
