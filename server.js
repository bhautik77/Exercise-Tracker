const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema } = mongoose;

const exerciseSchema = new Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date
});

const userSchema = new Schema({
  username: String,
});

const exerciseSchema = new Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date
});

let Person = mongoose.model("Person", personSchema);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
