const winston = require("winston"); //로그 파일 및 로그 레벨 관리 모듈
const winstonDaily = require("winston-daily-rotate-file"); //매일 날짜 별로 로그 파일 생성 및 관리 모듈 ( 시간이 지나면 자동으로 삭제 & 압축 관리 )
//const process = require('process');//process 모듈은 process.cwd() 값인 루트 경로를 얻기위해 불러
const { combine, timestamp, printf, colorize } = winston.format; //윈스턴 형식

const logDir = "logs"; //logs 디렉토리 하위에 로그 파일 저장 //

// //* 로그 파일 저장 경로 → 루트 경로/logs 폴더
// const logDir = `${process.cwd()}/logs`;

//logFormat : 로그 출력 포맷 모양 지정
const logFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});
/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */

//winston 로거 생성
const logger = winston.createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss", //format인자로 메시지에 대한 기본 설정함
    }),
    logFormat //log 출력 형식
  ),

  //transports : 로그 저장방식 정의
  transports: [
    new winstonDaily({
      level: "info", //info 레벨에서
      datePattern: "YYYY-MM-DD", //파일 날짜 형식
      dirname: logDir + "/info", //파일 경로
      filename: `%DATE%.log`, //file 이름 날짜로 저장
      maxFiles: 30, //최근 30일치 로그 파일을 남김
      zippedArchive: true, //아카이브된(저장하여 보관된) 로그 파일을 gzip으로 압축할지 여부
    }),
    // warn 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "warn",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/warn",
      filename: `%DATE%.warn.log`, // file 이름 날짜로 저장
      maxFiles: 30, // 30일치 로그 파일 저장
      zippedArchive: true,
    }),
    // error 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error", // error.log 파일은 /logs/error 하위에 저장
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),

    // //* error 레벨 로그를 저장할 파일 설정 (info에 자동 포함되지만 일부러 따로 빼서 설정)
    // new winstonDaily({
    //     level: 'error', // error 레벨에선
    //     datePattern: 'YYYY-MM-DD',
    //     dirname: logDir + '/error', // /logs/error 하위에 저장
    //     filename: `%DATE%.error.log`, // 에러 로그는 2020-05-28.error.log 형식으로 저장
    //     maxFiles: 30,
    //     zippedArchive: true,
    //  }),
  ],
});

//morgan winston 설정
logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};
// Production 환경이 아닌 경우(dev 등) 배포 환경에서는 최대한 자원을 안잡아 먹는 로그를 출력해야함
// Production 환경이 아닌, 개발 환경일 경우 파일 들어가서 일일히 로그 확인하기 번거로우니까 화면에서 바로 찍게 설정
//(로그 파일은 여전히 생성됨)
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }), // console 에 출력할 로그 컬러 설정 적용함
        logFormat // log format 적용
      ),
    })
  );
}
/*
if (process.env.NODE_ENV !== 'production') {
   logger.add(
      new winston.transports.Console({
         format: winston.format.combine(
            winston.format.colorize(), // log level별로 색상 적용하기
            winston.format.simple(), // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
         ),
      }),
   );
}
 */

module.exports = logger;
