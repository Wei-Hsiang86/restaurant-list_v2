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
    .then((rest) => res.send({ rest }))
    .catch((err) => res.status(422).json(err));
});

app.get("/restaurants/new", (req, res) => {
  res.send("create rest");
});

app.post("/restaurants", (req, res) => {
  res.send("add new rest");
});

app.get("/restaurants/:id", (req, res) => {
  res.send(`get restaurant: ${req.params.id}`);
});

app.get("/restaurants/:id/edit", (req, res) => {
  res.send(`get restaurant edit: ${req.params.id}`);
});

app.put("/restaurants/:id", (req, res) => {
  res.send("modify restaurant");
});

app.delete("/restaurants/:id", (req, res) => {
  res.send("delete restaurant");
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
})