const swaggerAutogen = require("swagger-autogen")();

const doc = {
 info: {
   title: "항해 실전주차 API",
   description: "hanghae99 API TEST",
 },
 host: "localhost:3000",
 schemes: ["http"],
};

const outputFile = "./swagger-output.json";// 터미널창 node ./swagger.js 입력 실행 후 생성될 파일 , 재실행시 초기화 주의
const endpointsFiles = ["./app.js"];//읽어올 라우터파일들

swaggerAutogen(outputFile, endpointsFiles, doc);