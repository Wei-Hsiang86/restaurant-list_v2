const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();

const passport = require("passport");

// 一樣要注意調用的位置
if (process.env.NODE_ENV === "development") {
  // 如果是開發者模式，就呼叫取用 dotenv 模組
  //.config() 是 dotenv 模組提供的一個方法，用於載入 .env 檔案中的環境變數並將它們設定到 process.env 中
  require("dotenv").config();
}

const { engine } = require("express-handlebars");
const methodOverride = require("method-override");

const router = require("./routes");

const messageHandler = require("./middlewares/message-handler");
const errorHandler = require("./middlewares/error-handler");

const port = 3000;

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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(messageHandler);

app.use(router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
