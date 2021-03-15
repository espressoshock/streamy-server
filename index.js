'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const audiobooksRoute = require('./routes/audiobooksRoute');
const audiotracksRoute = require('./routes/audiotracksRoute');
const usersRouter = require('./routes/usersRoute');

const app = express();
const port = 3001;

var admin = require('firebase-admin');

var serviceAccount = require('./config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// use router
app.use(cors());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/audiobooks', audiobooksRoute);
app.use('/audiotracks', audiotracksRoute);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server runnning at http://localhost:${port}`);
});
