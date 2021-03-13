'use strict';
const express = require('express');
var cors = require('cors');

const audiobooksRoute = require('./routes/audiobooksRoute');
const audiotracksRoute = require('./routes/audiotracksRoute');

const app = express();
const port = 3001;

// use router
app.use(cors());
app.use('/audiobooks', audiobooksRoute);
app.use('/audiotracks', audiotracksRoute);

app.listen(port, () => {
  console.log(`Server runnning at http://localhost:${port}`);
});
