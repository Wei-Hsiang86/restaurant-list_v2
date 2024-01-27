const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");

// 使用 sequelize 此 ORM 套件來操作資料庫
const db = require("../models");
const Restaurant = db.Restaurant;

router.get("/", (req, res) => {
  try {
    const webPara = req.originalUrl;
    const sort = webPara.includes("+") ? webPara.replace("+", " ") : webPara;
    const site = sort.indexOf("=");
    const len = sort.length;
    const mode = sort.slice(site + 1, len);
    const nowMode = mode === "/restaurants" ? "id" : mode;

    // 排序餐廳用
    option = {
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
      raw: true,
      order: [Sequelize.literal(nowMode)],
    })
      .then((restaurants) =>
        res.render("index", {
          restaurants,
          option,
          message: req.flash("success"),
        })
      )
      .catch((error) => {
        console.log(error);
        req.flash("error", "資料取得失敗Q");
        return res.redirect("back");
      });
  } catch (error) {
    console.log(error);
    req.flash("error", "伺服器錯誤");
    return res.redirect("back");
  }
});

router.get("/new", (req, res) => {
  try {
    return res.render("new", { error: req.flash("error") });
  } catch (error) {
    console.log(error);
    req.flash("error", "伺服器錯誤");
    return res.redirect("back");
  }
});

router.post("/", (req, res) => {
  try {
    const name = req.body.name;
    const name_en = req.body.name_en;
    const category = req.body.category;
    const image = req.body.image;
    const location = req.body.location;
    const phone = req.body.phone;
    const google_map = req.body.google_map;
    const rating = req.body.rating;
    const description = req.body.description;

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
    })
      .then(() => {
        req.flash("success", "新增成功!");
        return res.redirect("/restaurants");
      })
      .catch((error) => {
        console.log(error);
        req.flash("error", "新增失敗Q");
        return res.redirect("back");
      });
  } catch (error) {
    console.log(error);
    req.flash("error", "新增失敗Q");
    return res.redirect("back");
  }
});

router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;

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
      ],
      raw: true,
    })
      .then((restaurant) =>
        res.render("show", { restaurant, message: req.flash("success") })
      )
      .catch((error) => {
        console.log(error);
        req.flash("error", "資料取得失敗Q");
        return res.redirect("back");
      });
  } catch (error) {
    console.error(error);
    req.flash("error", "伺服器錯誤");
    return res.redirect("back");
  }
});

router.get("/:id/edit", (req, res) => {
  try {
    const id = req.params.id;

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
      ],
      raw: true,
    })
      .then((restaurant) => res.render("edit", { restaurant }))
      .catch((error) => {
        console.log(error);
        req.flash("error", "資料取得失敗Q");
        return res.redirect("back");
      });
  } catch (error) {
    console.error(error);
    req.flash("error", "伺服器錯誤");
    return res.redirect("back");
  }
});

router.put("/:id", (req, res) => {
  try {
    const body = req.body;
    const id = req.params.id;

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
      { where: { id } }
    )
      .then(() => {
        req.flash("success", "修改成功!");
        return res.redirect(`/restaurants/${id}`);
      })
      .catch((error) => {
        console.log(error);
        req.flash("error", "更新失敗Q");
        return res.redirect("back");
      });
  } catch (error) {
    console.error(error);
    req.flash("error", "伺服器錯誤");
    return res.redirect("back");
  }
});

router.delete("/:id", (req, res) => {
  try {
    const id = req.params.id;

    return Restaurant.destroy({ where: { id } })
      .then(() => {
        req.flash("success", "刪除成功!");
        return res.redirect("/restaurants");
      })
      .catch((error) => {
        console.log(error);
        req.flash("error", "刪除失敗:(");
        return res.redirect("back");
      });
  } catch (error) {
    console.error(error);
    req.flash("error", "刪除失敗:(");
    return res.redirect("back");
  }
});

module.exports = router