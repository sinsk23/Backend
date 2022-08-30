const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const rotuer = require("./routes");
const port = 3000;
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  cors({
    credentials: true,

    origin: "http://localhost:3000",
  })
);


app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));//swagger app.js 세팅
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // body로 들어오는 json 형태의 데이터를 파싱해준다.
app.use("/api", rotuer);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
module.exports = app;
