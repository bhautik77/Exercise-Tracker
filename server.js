const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { Schema } = mongoose;

const exerciseSchema = new Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
});

const userSchema = new Schema({
  username: String,
});

const logSchema = new Schema({
  username: String,
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: Date,
    },
  ],
});

let Exercise = mongoose.model("Exercise", exerciseSchema);
let User = mongoose.model("User", userSchema);
let Log = mongoose.model("Log", logSchema);

app.use(cors(), bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", function (req, res, done) {
  const user = new User({
    url: req.body.username,
  });
  User.save(function (err, data) {
    if (err) return console.error(err);
    return done(null, data);
  });
  User.findOne({ username: req.params.username }, function (err, doc) {
    if (err) return console.error(err);
    res.json({ username: req.body.username, _id: doc._id });
  });
});

app.get("/api/user", function (req, res, done) {
  User.find({}, function (err, docs) {
    res.json({ username: docs.username, id: docs._id });
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
