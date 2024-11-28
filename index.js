// index.js
const express = require("express");
const cors = require("cors");
const app = express();
const { connectDB } = require("./db/DB.js");
const User = require("./db/models/User");
const Product = require("./db/models/Product");
const bodyParser = require("body-parser");
const { SolapiMessageService } = require("solapi");
const dotenv = require("dotenv").config();
const routes = require("./routes/routes.js");
const swaggerDocs = require("./swagger/swagger.js");
const swaggerUI = require("swagger-ui-express");

/**
 * review 갈아엎기 (더미데이터 새로 만들고 한글로 바꾸기)
 * post, put 등의 api 체크
 *
 */

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => res.send("linked!"));
app.use("/api", routes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

console.log("hello, world!");

const port = process.env.PORT || 8001;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server Up and running at ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB connection error:", err);
  });
