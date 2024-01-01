const express = require("express");
const app = express();

const db = require("./models");
const Restaurant = db.Restaurant;

const port = 3000;

app.get("/", (req, res) => {
  res.send("yoyoyo~");
});

app.get("/restaurants", (req, res) => {
  return Restaurant.findAll()
    .then((rss) => res.send({ rss }))
    .catch((err) => res.status(422).json(err));
});

app.listen