'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Readable } = require('stream');
const ObjectID = require('mongodb').ObjectID;

const mongodb = require('mongodb');
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

/* POST /audiotracks
   ============================= */
router.post('/', (req, res) => {
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: { fields: 1, fileSize: 16000000, files: 1, parts: 2 },
  });
  upload.single('audiotrack')(req, res, (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: 'Upload Request Validation Failed' });
    } else if (!req.body.name) {
      return res.status(400).json({ message: 'No track name in request body' });
    }

    let audiotrackFN = req.body.name;

    // Covert buffer to Readable Stream
    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    let bucket = new mongodb.GridFSBucket(db, {
      bucketName: 'audiotracks',
    });

    let uploadStream = bucket.openUploadStream(audiotrackFN);
    let id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on('error', () => {
      return res.status(500).json({ message: 'Error uploading file' });
    });

    uploadStream.on('finish', () => {
      return res.status(201).json({
        message: 'audiotrack #' + id + ' uploaded successfully',
      });
    });
  });
});
/* GET /audiotrack/:audiotrackID
   ============================= */
router.get('/:audiotrackID', (req, res) => {
  let audiotrackID;
  try {
    console.log(req.params.audiotrackID);
    audiotrackID = new ObjectID(req.params.audiotrackID);
  } catch (err) {
    return res.status(400).json({
      message: 'Invalid audiotrackID',
    });
  }
  res.set('content-type', 'audio/mp3');
  res.set('accept-ranges', 'bytes');

  let bucket = new mongodb.GridFSBucket(db, {
    bucketName: 'audiotracks',
  });

  let downloadStream = bucket.openDownloadStream(audiotrackID);

  downloadStream.on('data', (chunk) => {
    res.write(chunk);
  });

  downloadStream.on('error', () => {
    res.sendStatus(404);
  });

  downloadStream.on('end', () => {
    res.end();
  });
});

module.exports = router;
