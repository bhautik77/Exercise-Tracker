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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
