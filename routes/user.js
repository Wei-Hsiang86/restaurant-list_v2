const express = require("express");
const router = express.Router();

// 使用 sequelize 此 ORM 套件來操作資料庫
const db = require("../models");
const User = db.User;

router.post("/", (req, res) => {
  return res.send(req.body);
});

module.exports = router