const express = require("express");
const mongoose = require('mongoose');

const app = express();

//DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
// .connect is an action to perform
// .then is a promise if .connect works fine,
// .catch means if it doesnt work fine
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("cool website yeah");
});

// first one is for deploying on Heroku server
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server started at ${port}`);
});