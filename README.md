# AC exercising \_ My Restaurant List

- 練習製作餐廳清單，可以瀏覽收藏的餐廳、相關資訊等等
- 此次 V2 資料使用 mysql ，若想參考使用 json 檔案，可至另個專案查看

## 功能

- 登入/登出功能＆第三方登入 (2.3 新增)
- 分頁 (2.2 新增)
- 搜尋＆排序功能，排序使用絕對排序 (2.1 新增)
- 列出所有餐廳
- 瀏覽餐廳相關資訊
- 連結餐廳的地址到 Google 地圖

## 已知問題

- ~~分頁無法排序~~ (已於 2.2.1 修復)
- ~~搜尋無法排序~~ (已於 2.1.1 修復)

## 欲新增功能/可優化處

- 搜尋結果也可以分頁
- 優化 /routes/index.js 之程式抽象概念

## 版本

- ~~2.3.0~~ (版本號：0f3ff58) / 2.3.1 (版本號：目前)
- ~~2.2.0~~ (版本號：886e8d0) / ~~2.2.1~~ (版本號：4bae083) / 2.2.2 (版本號：05b6e44)
- ~~2.1.0~~ (版本號：7654df7) / ~~2.1.1~~ (優化搜尋。版本號：7206781)
- ~~2.0~~ (版本號：46b5cfe)

## 使用

1. 請先確認本地有安裝 node.js 與 mysql

2. 將專案 clone 到本地

3. 在本地開啟之後，透過終端機進入資料夾，輸入：
   (下載 npm 以及這個專案所需相關套件)

   ```
   npm install
   ```

4. 安裝完畢後，設定資料庫名稱(這裡設為 restaurant)：
   **注意資料庫名稱，需與'/config/config.json'中 database 的名稱一致**
   **且下方 password 亦要輸入自行設定的密碼**

   ```
   create database restaurant
   ```

5. 建立資料表：

   ```
   npm run dbtable
   ```

6. 建立預設資料：

   ```
   npm run seed
   ```

7. 執行 app.js：

   ```
   npm run start
   ```

8. 若看見此行訊息則代表順利運行，打開瀏覽器進入到以下網址：

   ```
   Listening on http://localhost:3000
   ```

9. 若想要停止伺服運作：

   ```
   ctrl + c
   ```

## 開發工具

- 執行環境：[Node.js](https://nodejs.org/docs/latest/api/): ^18.15.0
- 應用程式框架：[express](https://expressjs.com/): ^4.18.2
- 樣板引擎：[express-handlebars](https://handlebarsjs.com/): ^7.0.4
- 樣式框架：[bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/): ^5.1.3
- 自行/圖案：[font-awesome](https://fontawesome.com/): ^6.4.2

- 資料庫相關：

  1. [mysql2](https://www.npmjs.com/package/mysql2): ^3.2.0
  2. [sequelize-cli](https://sequelize.org/docs/v6/): ^6.6.0

- 驗證登入相關：
  1. [passport](https://www.passportjs.org/): ^0.6.0
  2. passport-local: ^1.0.0
  3. passport-facebook: ^3.0.0
  4. [bcryptjs](https://www.npmjs.com/package/bcryptjs): ^2.4.3

- NPM 套件：
  1. [express-session](https://www.npmjs.com/package/express-session): ^1.17.3
  2. [connect-flash](https://www.npmjs.com/package/connect-flash): ^0.1.1
  3. [dotenv](https://www.npmjs.com/package/dotenv): ^16.0.3
  4. [method-override](https://www.npmjs.com/package/method-override): ^3.0.0
