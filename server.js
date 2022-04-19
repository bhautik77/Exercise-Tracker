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

const exerciseSchema = new Schema(
  {
    username: String,
    description: String,
    duration: Number,
    date: Date,
  },
  { versionKey: false }
);

const userSchema = new Schema(
  {
    username: String,
  },
  { versionKey: false }
);

const logSchema = new Schema(
  {
    username: String,
    count: Number,
    log: [
      {
        description: String,
        duration: Number,
        date: Date,
      },
    ],
  },
  { versionKey: false }
);

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
    username: req.body.username,
  });
  user.save(function (err, data) {
    if (err) return console.error(err);
    return done(null, data);
  });
  User.findOne({ username: req.params.username }, function (err, docs) {
    if (err) return console.error(err);
    res.json({ username: req.body.username, _id: docs.id });
  });
});

app.get("/api/users", function (req, res, done) {
  User.find({}, function (err, docs) {
    var userList = new Array();
    for (let i = 0; i < docs.length; i++)
      userList.push({ username: docs[i].username, _id: docs[i]._id });
    res.send(userList);
  });
});

app.post("/api/users/:_id/exercises", function (req, res, done) {
  User.findById(req.body._id, function (err, docs) {
    var date;
    if (req.body.date == null) date = new Date();
    const exercise = new Exercise({
      username: docs.username,
      description: req.body.description,
      duration: req.body.duration,
      date: date.toDateString(),
    });
    exercise.save(function (err, data) {
      if (err) return console.error(err);
      return done(null, data);
    });
    res.json({
      username: docs.username,
      description: req.body.description,
      duration: req.body.duration,
      date: date.toDateString(),
    });
  });
});

app.get("/api/users/:_id/logs", function (req, res, done) {});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
