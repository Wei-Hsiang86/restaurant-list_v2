const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const restaurants = require("./restaurants");

router.use("/restaurants", restaurants);

// 使用 sequelize 此 ORM 套件來操作資料庫
const db = require("../models");
const Restaurant = db.Restaurant;

let searchData = [];

router.get("/", (req, res) => {
  res.redirect("/restaurants");
});

//查詢路由
router.get("/search", (req, res, next) => {
  const keyword = req.query.keyword?.trim();
  searchData = [];

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

      console.log(searchData);

      return res.render("search", {
        restaurants,
      });
    })
    .catch((error) => {
      error.errorMessage = "查詢失敗Q";
      next(error);
    });
});

router.post("/search", (req, res, next) => {
  const nowMode = req.body.sortMode;
  console.log(nowMode);

  // 顯示排序用
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
      })
    )
    .catch((error) => {
      error.errorMessage = "資料取得失敗Q";
      next(error);
    });
});

/*
  // 按下 search 鈕，input 沒有 value，也未曾搜尋過
  if (lastSearchValue === keyword) {
    // 初次搜尋，搜尋空白
    if (lastSearchValue === "") {
      return res.redirect("/restaurants");
    } else {
      // 同樣的搜尋，要排序
      const webPara = req.originalUrl;
      const sort = webPara.includes("+") ? webPara.replace("+", " ") : webPara;
      const site = sort.indexOf("=");
      const len = sort.length;
      const mode = sort.slice(site + 1, len);
      const nowMode = webPara.includes("=") ? "id" : mode;

      // 排序餐廳用
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
        order: [Sequelize.literal("id")],
      })
        .then((restaurants) =>
          res.render("search", {
            restaurants,
            sortSelect,
          })
        )
        .catch((error) => {
          error.errorMessage = "資料取得失敗Q";
          next(error);
        });
    }

    // 按下 search 鈕，有搜尋過
  } else {
    // 非初次搜尋，搜尋欄空白
    if (searched === true) {
      return res.redirect("/restaurants");
    } else {
      // 新的搜尋
      searchData = [];
      lastSearchValue = keyword;
      console.log(lastSearchValue);
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

          console.log(searchData);
          return res.render("search", {
            restaurants,
            searchValue,
            searched,
            searchData,
          });
        })
        .catch((error) => {
          error.errorMessage = "查詢失敗Q";
          next(error);
        });
    }
  }
});
*/

module.exports = router;
