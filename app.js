const express = require("express");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const { Op } = require("sequelize");
const app = express();
const port = 3000;

// 使用 sequelize 此 ORM 套件來操作資料庫
const db = require("./models");
const Restaurant = db.Restaurant;

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("views", "./views");
app.set("view engine", ".hbs");

// 使用 static files (樣式風格設定檔)
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.redirect("/restaurants");
});

app.get("/restaurants", (req, res) => {
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
  })
    .then((restaurants) => res.render("index", { restaurants }))
    .catch((err) => console.log(err));
});

app.get("/restaurants/new", (req, res) => {
  return res.render("new");
});

app.post("/restaurants", (req, res) => {
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
    .then(() => res.redirect("/restaurants"))
    .catch((err) => console.log(err));
});

//查詢路由
app.get("/search", (req, res) => {
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
    .catch((err) => console.log(err));
});

app.get("/restaurants/:id", (req, res) => {
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
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((err) => console.log(err));
});

app.get("/restaurants/:id/edit", (req, res) => {
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
    .catch((err) => console.log(err));
});

app.put("/restaurants/:id", (req, res) => {
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
  ).then(() => res.redirect(`/restaurants/${id}`));
});

app.delete("/restaurants/:id", (req, res) => {
  const id = req.params.id;

  return Restaurant.destroy({ where: { id } }).then(() =>
    res.redirect("/restaurants")
  );
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
