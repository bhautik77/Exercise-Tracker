const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
});

const exerciseSchema = new Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
});

const logSchema = new Schema({
  username: String,
  count: Number,
  log: [],
});

var User = mongoose.model("User", userSchema);
var Exercise = mongoose.model("Exercise", exerciseSchema);
var Log = mongoose.model("Log", logSchema);

app.use(cors(), bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", function (req, res) {
  const user = new User({
    username: req.body.username,
  });
  user.save(function (err, data) {
    if (err) return console.error(err);
  });
  const log = new Log({
    _id: user._id,
    username: req.body.username,
    count: 0,
    log: [],
  });
  log.save(function (err, data) {
    if (err) return console.error(err);
  });
  res.json({ username: user.username, _id: user._id });
});

app.get("/api/users", function (req, res) {
  User.find({}, function (err, users) {
    res.send(users);
  });
});

app.post("/api/users/:_id/exercises", function (req, res) {
  User.findById(req.params._id, function (err, user) {
    var date;
    if (req.body.date == undefined || req.body.date == "")
      date = new Date();
    else
      date = new Date(req.body.date);
    const exercise = new Exercise({
      _id: user._id,
      username: user.username,
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date.toDateString(),
    });
    exercise.save(function (err, data) {
      if (err) return console.error(err);
    });
    Log.findById();
    res.send({_id: exercise._id,username: exercise.username,description: exercise.description,duration: exercise.duration, date: exercise.date.toDateString()});
  });
  
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
