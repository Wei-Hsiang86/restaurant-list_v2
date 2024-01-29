# AC exercising _ My Restaurant List

- 練習製作餐廳清單，可以瀏覽收藏的餐廳、相關資訊等等
- 此次V2資料使用 mysql ，若想參考使用 json 檔案，可去另個專案查看

## 功能

- 列出所有餐廳
- 瀏覽餐廳相關資訊
- 連結餐廳的地址到 Google 地圖
- 搜尋＆排序功能 (2.1新增)
- 分頁 (2.2新增)

## 已知問題

- ~~搜尋無法排序~~ (已於 2.1.1 修復)
- 分頁無法排序

## 版本

- 2.2 (目前版本，優化結構、使用 dotenv 取得敏感資料。版本號：)
- ~~2.1.0~~ (版本號：7654df7) / ~~2.1.1~~ (優化搜尋。版本號：5772a2d)
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
  npx sequelize db:migrate
  ```
6. 建立預設資料：

  ```
  npx sequelize-cli db:seed:all
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

- Node.js: 18.15.0
- express: 4.18.2
- express-handlebars: 7.0.4
- express-session: 1.17.3
- dotenv: 16.0.3
- connect-flash: 0.1.1
- method-override: 3.0.0
- mysql2: 3.2.0
- sequelize: 6.30.0
- sequelize-cli: 6.6.0
- bootstrap: 5.1.3
- font-awesome: 6.4.2