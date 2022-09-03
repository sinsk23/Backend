const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const appRoot = require("app-root-path");
const process = require("process");

const logDir = `${appRoot}/logs`;

const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`; // log 출력 포맷 정의
});

const Logger = winston.createLogger({
  format: combine(
    label({
      label: "System Name",
    }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat // 위에서 정의한 level, message, label, timestamp
  ),
  transports: [
    new winstonDaily({
      level: "info",
      datePattern: "YYYY-MM--DD",
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
  exceptionHandlers: [
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir,
      filename: `%DATE%.exceptionlog`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

//production 환경이 아닐 때
if (process.env.NODE_ENV !== "production") {
  Logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // level에 따라 색깔을 다르게 출력
        winston.format.simple() // 우리가 정의한 format이 아닌 winston에서 정의한 포맷으로 출력
        // ex) `${info.level}: ${info.message} JSON.stringfy({...rest})
      ),
    })
  );
}
module.exports = Logger;
