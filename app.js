const express = require("express");
const app = express();
const port = 3000;

const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const { engine } = require("express-handlebars");

// 一樣要注意調用的位置，放在 const app 後就無法執行了
if (process.env.NODE_ENV === "development") {
  require("dotenv").config();
}

const router = require("./routes");

const messageHandler = require("./middlewares/message-handler");
const errorHandler = require("./middlewares/error-handler");

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

app.use(messageHandler);

app.use(router);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
