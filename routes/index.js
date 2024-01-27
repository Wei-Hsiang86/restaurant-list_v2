const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const restaurants = require("./restaurants");

router.use("/restaurants", restaurants);

// 使用 sequelize 此 ORM 套件來操作資料庫
const db = require("../models");
const Restaurant = db.Restaurant;

router.get("/", (req, res) => {
  res.redirect("/restaurants");
});

//查詢路由
router.get("/search", (req, res, next) => {
  const keyword = req.query.keyword?.trim();

  return Restaurant.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.like]: "%" + keyword + "%",
          },
        },
        {
          name_en: {
            [Op.like]: "%" + keyword + "%",
          },
        },
        {
          category: {
            [Op.like]: "%" + keyword + "%",
          },
        },
        {
          location: {
            [Op.like]: "%" + keyword + "%",
          },
        },
        {
          phone: {
            [Op.like]: "%" + keyword + "%",
          },
        },
        {
          rating: {
            [Op.like]: keyword,
          },
        },
        {
          description: {
            [Op.like]: "%" + keyword + "%",
          },
        },
      ],
    },
    raw: true,
  })
    .then((restaurants) => res.render("index", { restaurants }))
    .catch((error) => {
      error.errorMessage = "查詢失敗Q"
      next(error)
    });
});

module.exports = router;
