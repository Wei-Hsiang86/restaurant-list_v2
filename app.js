const express = require("express");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const { engine } = require("express-handlebars");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const app = express();
const port = 3000;

// 使用 sequelize 此 ORM 套件來操作資料庫
const db = require("./models");
const Restaurant = db.Restaurant;

// handlebars 設定
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("views", "./views");
app.set("view engine", ".hbs");

// 使用 static files (樣式風格設定檔)
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "ThisIsSecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.get("/", (req, res) => {
  res.redirect("/restaurants");
});

app.get("/restaurants", (req, res) => {
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

app.get("/restaurants/new", (req, res) => {
  try {
    return res.render("new", { error: req.flash("error") });
  } catch (error) {
    console.log(error);
    req.flash("error", "伺服器錯誤");
    return res.redirect("back");
  }
});

app.post("/restaurants", (req, res) => {
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

//查詢路由
app.get("/search", (req, res) => {
  try {
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
        console.log(error);
        req.flash("error", "查詢失敗Q");
        return res.redirect("back");
      });
  } catch (error) {
    console.log(error);
    req.flash("error", "查詢失敗Q");
    return res.redirect("back");
  }
});

app.get("/restaurants/:id", (req, res) => {
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

app.get("/restaurants/:id/edit", (req, res) => {
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

app.put("/restaurants/:id", (req, res) => {
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

app.delete("/restaurants/:id", (req, res) => {
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

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
