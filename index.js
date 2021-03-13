'use strict';
const express = require('express');
const audiobooksRoute = require('./routes/audiobooksRoute');

const app = express();
const port = 3000;

// use router
app.use('/audiobooks', audiobooksRoute);

app.listen(port, () => {
  console.log(`Server runnning at http://localhost:${port}`);
});
