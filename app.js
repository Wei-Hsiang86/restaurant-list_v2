const express = require("express")
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const { engine } = require("express-handlebars");

const app = express();
const port = 3000;

const router = require('./routes');

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
    secret: "ThisIsSecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use(messageHandler)

app.use(router)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
