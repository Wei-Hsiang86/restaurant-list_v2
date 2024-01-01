const express = require("express");
const { engine } = require("express-handlebars");
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
  res.send("add new rest");
});

// 查詢路由
app.get("/search", (req, res) => {
  const keyword = req.query.keyword?.trim();
  const matchRestaurants = keyword
    ? Restaurant.filter((rr) =>
        Object.values(rr).some((property) => {
          if (typeof property === "string") {
            return property
              .toLocaleLowerCase()
              .includes(keyword.toLocaleLowerCase());
          }
          return false;
        })
      )
    : Restaurant;
  res.render("index", { restaurants: matchRestaurants, keyword });
});

// 設定動態路由
// app.get("/restaurants/:id", (req, res) => {
//   const id = req.params.id;
//   const restaurant = Restaurant.find((rr) => rr.id.toString() === id);
//   res.render("show", { restaurant });
// });

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
});
