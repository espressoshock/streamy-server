'use strict';
const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');

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
    chapters: [],
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
/* PUT /audiobooks/:audiobookID
   ============================= */
router.put('/:audiobookID', (req, res) => {
  let audiobookID;
  try {
    console.log(req.params.audiobookID);
    audiobookID = new ObjectID(req.params.audiobookID);
  } catch (err) {
    return res.status(400).json({
      message: 'Invalid audiobookID',
    });
  }
  const title = req.body.title,
    author = req.body.author,
    description = req.body.description,
    genre = req.body.genre,
    language = req.body.language,
    coverImage = req.body.coverImage,
    chapterID = new ObjectID(req.body.chapterID);

  const doc = Object.assign(
    {},
    req.body.title === undefined ? null : { title },
    req.body.author === undefined ? null : { author },
    req.body.description === undefined ? null : { description },
    req.body.genre === undefined ? null : { genre },
    req.body.language === undefined ? null : { language },
    req.body.coverImage === undefined ? null : { coverImage }
  );

  console.log('received: ', chapterID);

  if (chapterID !== null) {
    db.collection('audiobooks')
      .update({ _id: audiobookID }, { $push: { chapters: chapterID } })
      .then((resp) => {
        console.log('chapterid added correctly');
        res.json({
          status: 200,
          data: resp,
          message: 'chapter added correctly!' + resp,
        });
      })
      .catch((err) => {
        console.log('err', err);
        res.json({
          status: 200,
          data: doc,
          message: 'Success!' + resp,
        });
      });
  }
  if (Object.keys(doc).length !== 0) {
    db.collection('audiobooks')
      .updateOne({ _id: audiobookID }, { $set: doc })
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
  }
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
    audiobookID: new ObjectID(req.body.audiobookID),
    audiotrackID: new ObjectID(req.body.audiotrackID),
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
/* PUT /audiobooks/:audiobookID/chapters/:chapterID
   ============================= */
router.put('/:audiobookId/chapters/:chapterId', (req, res) => {
  let audiobookId, chapterId;
  try {
    audiobookId = new ObjectID(req.params.audiobookId);
    chapterId = new ObjectID(req.params.chapterId);
  } catch (err) {
    return res.status(400).json({
      message: 'Invalid audiobookID or chapterID',
    });
  }
  const title = req.body.title,
    reader = req.body.reader,
    duration = req.body.duration,
    index = req.body.index,
    audiobookID = req.body.audiobookID,
    audiotrackID = mongoose.Types.ObjectId(req.body.audiotrackID);
  const doc = Object.assign(
    {},
    req.body.title === undefined ? null : { title },
    req.body.reader === undefined ? null : { reader },
    req.body.duration === undefined ? null : { duration },
    req.body.index === undefined ? null : { index },
    req.body.audiobookID === undefined ? null : { audiobookID },
    req.body.audiotrackID === undefined ? null : { audiotrackID }
  );

  db.collection('chapters')
    .updateOne({ _id: chapterId }, { $set: doc })
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
