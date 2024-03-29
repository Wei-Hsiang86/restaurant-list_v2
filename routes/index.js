const express = require("express");
const router = express.Router();
const passport = require("passport");

const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

// 使用 sequelize 此 ORM 套件來操作資料庫
const db = require("../models");
const Restaurant = db.Restaurant;

let searchData = [];
let searchValue = "";

const restaurants = require("./restaurants");
const users = require("./users");
const authHandler = require("../middlewares/auth-handler");

// 分配子路由
router.use("/restaurants", authHandler, restaurants);
router.use("/users", users);

router.get("/", (req, res) => {
  res.redirect("/restaurants");
});

router.get("/register", (req, res) => {
  return res.render("register");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/restaurants",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get(
  "/login/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/oauth2/redirect/facebook",
  passport.authenticate("facebook", {
    successRedirect: "/restaurants",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    return res.redirect("/login");
  });
});

//搜尋路由
router.get("/search", (req, res, next) => {
  // 搜尋內容
  const keyword = req.query.keyword?.trim();
  searchData = [];
  searchValue = keyword;

  // // 分頁用
  // const page = parseInt(req.query.page) || 1;
  // const limit = 6;

  if (keyword === "") {
    return res.redirect("/restaurants");
  }

  // 搜尋功能
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
    .then((restaurants) => {
      for (let i = 0; i < restaurants.length; i++) {
        searchData.push(restaurants[i].id);
      }

      return res.render("search", {
        restaurants,
        // restaurants: restaurants.slice((page - 1) * limit, page * limit),
        // prev: page > 1 ? page - 1 : page,
        // next: page + 1,
        // page,
        searchValue,
      });
    })
    .catch((error) => {
      error.errorMessage = "查詢失敗Q";
      next(error);
    });
});

// 搜尋資料排序功能
router.post("/search", (req, res, next) => {
  const nowMode = req.body.sortMode;
  console.log(nowMode);

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
    where: {
      id: {
        [Op.or]: searchData,
      },
    },
    raw: true,
    order: [Sequelize.literal(nowMode)],
  })
    .then((restaurants) =>
      res.render("search", {
        restaurants,
        sortSelect,
        searchValue,
      })
    )
    .catch((error) => {
      error.errorMessage = "資料取得失敗Q";
      next(error);
    });
});

module.exports = router;
