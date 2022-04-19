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
  date: Date
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
    }
  ]
});

let Exercise = mongoose.model("Exercise", exerciseSchema);
let User = mongoose.model("User", userSchema);
let Log = mongoose.model("Log", logSchema);

app.use(cors(), bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});


app.post("/api/users", function (req, res) {
  const User = new User({
        url: req.body.url.toString(),
        short_url: randNumber,
      });
      url.save(function (err, data) {
        if (err) return console.error(err);
        return done(null, data);
      });
      res.json({ original_url: req.body.url, short_url: randNumber });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
