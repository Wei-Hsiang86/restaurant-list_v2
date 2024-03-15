const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");

// 使用 sequelize 此 ORM 套件來操作資料庫
const db = require("../models");
const Restaurant = db.Restaurant;

let nowPage = 1;
let nowMode = "id";

router.get("/", (req, res, next) => {
  // 排序用
  const mode = req.query.sortMode;
  nowMode = typeof mode !== "undefined" ? mode : nowMode;

  // 分頁用
  const page = Number.isNaN(parseInt(req.query.page))
    ? nowPage
    : parseInt(req.query.page);
  const limit = 6;
  const userId = req.user.id;
  nowPage = page;

  sortSelect = {
    id: nowMode === "id" ? true : false,
    name1: nowMode === "name" ? true : false,
    name2: nowMode === "name DESC" ? true : false,
    rating1: nowMode === "rating" ? true : false,
    rating2: nowMode === "rating DESC" ? true : false,
    location: nowMode === "location" ? true : false,
    category: nowMode === "category" ? true : false,
    appear: "selected",
  };

  return Restaurant.findAll({
    attributes: [
      "id",
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
    ],
    where: { userId },
    raw: true,
    order: [Sequelize.literal(nowMode)],
    offset: (nowPage - 1) * limit,
    limit,
  })
    .then((restaurants) => {
      return res.render("index", {
        restaurants,
        prev: nowPage > 1 ? nowPage - 1 : nowPage,
        next: nowPage + 1,
        nowPage,
        sortSelect,
      });
    })
    .catch((error) => {
      error.errorMessage = "資料取得失敗Q";
      next(error);
    });
});

router.get("/new", (req, res) => {
  return res.render("new");
});

router.post("/", (req, res, next) => {
  const name = req.body.name;
  const name_en = req.body.name_en;
  const category = req.body.category;
  const image = req.body.image;
  const location = req.body.location;
  const phone = req.body.phone;
  const google_map = req.body.google_map;
  const rating = req.body.rating;
  const description = req.body.description;
  const userId = req.user.id;

  return Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
    userId,
  })
    .then(() => {
      req.flash("success", "新增成功!");
      return res.redirect("/restaurants");
    })
    .catch((error) => {
      error.errorMessage = "新增失敗Q";
      next(error);
    });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;

  return Restaurant.findByPk(id, {
    attributes: [
      "id",
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
      "userId",
    ],
    raw: true,
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash("error", "找不到資料");
        return res.redirect("/restaurants");
      }

      if (restaurant.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/restaurants");
      }

      res.render("show", { restaurant });
    })
    .catch((error) => {
      error.errorMessage = "資料取得失敗Q";
      next(error);
    });
});

router.get("/:id/edit", (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;

  return Restaurant.findByPk(id, {
    attributes: [
      "id",
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
      "userId",
    ]
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash("error", "找不到資料");
        return res.redirect("/restaurants");
      }

      if (restaurant.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/restaurants");
      }

      res.render("edit", { restaurant });
    })

    .catch((error) => {
      error.errorMessage = "資料取得失敗Q";
      next(error);
    });
});

router.put("/:id", (req, res, next) => {
  const body = req.body;
  const id = req.params.id;
  const userId = req.user.id;

  return Restaurant.findByPk(id, {
    attributes: [
      "id",
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
      "userId",
    ],
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash("error", "找不到資料");
        return res.redirect("/restaurants");
      }

      if (restaurant.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/restaurants");
      }

      return Restaurant.update(
        {
          name: body.name,
          name_en: body.name_en,
          category: body.category,
          image: body.image,
          location: body.location,
          phone: body.phone,
          google_map: body.google_map,
          rating: body.rating,
          description: body.description,
        },
        { where: { id } })

        .then(() => {
          req.flash("success", "修改成功!");
          return res.redirect(`/restaurants/${id}`);
        });
    })
    .catch((error) => {
      error.errorMessage = "更新失敗Q";
      next(error);
    });
});

router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;

  return Restaurant.findByPk(id, {
    attributes: [
      "id",
      "name",
      "name_en",
      "category",
      "image",
      "location",
      "phone",
      "google_map",
      "rating",
      "description",
      "userId",
    ],
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash("error", "找不到資料");
        return res.redirect("/restaurants");
      }

      if (restaurant.userId !== userId) {
        req.flash("error", "權限不足");
        return res.redirect("/restaurants");
      }

      return Restaurant.destroy({ where: { id } })
        .then(() => {
          req.flash("success", "刪除成功!");
          return res.redirect("/restaurants");
        });
    })

    .catch((error) => {
      error.errorMessage = "刪除失敗Q";
      next(error);
    });
});

module.exports = router;
