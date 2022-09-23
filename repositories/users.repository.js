const { Record, Post, Like, User } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

require("dotenv").config;
const mailer = require("../node-mailer");
const help = require("korean-regexp");
const day = require("../node-scheduler");
const emailService = new mailer();

// redis 연결
const redis = require("redis");
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true,
});
redisClient.on("connect", () => console.info("Redis 연결 성공!"));
redisClient.on("error", (err) =>
  console.error("Redis Client Error", err.message)
);
redisClient.connect();

class UserRepositiory {
  emailService = new mailer();
  //유저가 런닝한 거리와 시간을 받아 Record 테이블에 저장하는 함수
  addDistance = async (userId, distance, time) => {
    const getUserRecord = await Record.findOne({ where: { userId } });
    let percent = 0;
    let getDistance = Number(getUserRecord.distance + distance);
    percent = getDistance / getUserRecord.goal;

    let weekOfDistance = getUserRecord.weekOfDistance;
    let weekOfTime = getUserRecord.weekOfTime;
    if (day.day === 0) {
      day.day = 6;
      weekOfDistance[day.day] += distance;
      weekOfTime[day.day] += time;
    } else if (day.day !== 0) {
      weekOfDistance[day.day - 1] += distance;
      weekOfTime[day.day - 1] += time;
    }
    if (!getUserRecord) {
      const createdRecord = await Record.create({ userId, distance, time });
      return createdRecord;
    } else {
      const userDistance = getUserRecord.distance;
      const userTime = getUserRecord.time;
      const updatedRecord = await Record.update(
        {
          distance: distance + userDistance,
          percent: percent * 100,
          weekOfDistance: weekOfDistance,
          weekOfTime: weekOfTime,
          time: time + userTime,
        },
        { where: { userId } }
      );
      return updatedRecord;
    }
  };
  //유저의 닉네임을 받아 해당 닉네임을 가진 유저가 작성한 게시글을 리턴하는 함수
  getUserPost = async (nickname, pagenum) => {
    let offset = 0;

    if (pagenum > 1) {
      offset = 5 * (pagenum - 1);
    }
    const getAllPosts = await Post.findAll({
      where: { nickname },
      offset: offset,
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    return getAllPosts;
  };
  //로그인한 유저가 게시글을 불러올 때 좋아요를 누른 게시글이면 빨간색 하트를 표시하도록 likeDone을 리턴 및
  //게시글의 내용, 해쉬태그, 이미지등을 리턴하는 함수
  getPost = async (postId, userId) => {
    let isLike;
    if (userId) {
      isLike = await Like.findOne({ where: { userId, postId } });
      if (isLike) {
        await Post.update({ likeDone: true }, { where: { postId } });
      } else {
        await Post.update({ likeDone: false }, { where: { postId } });
      }
    }

    const getPost = await Post.findOne({ where: { postId } });

    return getPost;
  };
  //닉네임을 받아 해당 닉네임을 가진 유저를 검색하는 함수
  searchUser = async (nickname) => {
    nickname = help.explode(nickname).join("");

    const autoSearchUser = await User.findAll({
      where: {
        consonant: { [Op.like]: nickname + "%" },
      },
    });

    const returnData = autoSearchUser.map((el) => el.nickname);
    const test = await User.findAll({
      where: {
        nickname: { [Op.in]: returnData },
      },
      attributes: ["nickname", "image"],
    });
    return test;
  };
  //유저아이디와 목표를 받아 해당 유저의 목표를 설정하는 함수
  setGoal = async (goal, userId) => {
    const setGoal = await Record.create({ goal, userId });
    return setGoal;
  };
  //유저아이디와 목표를 받아 해당 유저의 목표를 수정하는 함수
  changeGoal = async (goal, userId) => {
    const getUserRecord = await Record.findOne({ where: { userId } });
    let percent = 0;
    let getDistance = Number(getUserRecord.distance);
    percent = (getDistance / goal) * 100;

    const changeGoal = await Record.update(
      { goal, percent },
      { where: { userId } }
    );

    return changeGoal;
  };
  //유저아이디를 받아 해당 유저가 목표를 작성했는지 확인하는 함수
  checkGoal = async (userId) => {
    const checkGoal = await Record.findOne({ where: { userId } });

    return checkGoal;
  };
  //유저아이디와 프로필이미지를 받고 해당 유저의 프로필 이미지 변경 및 해당 유저가 작성한 게시글의 프로필 이미지도 변경하는 함수
  changeImage = async (image, userId) => {
    const changeImage = await User.update({ image }, { where: { userId } });
    const findId = await Post.findAll({ wherne: { userId } });
    let postIdArr = [];
    for (let i = 0; i < findId.length; i++) {
      postIdArr.push(findId[i].postId);
    }

    await Post.update(
      { profile: image },
      {
        where: {
          postId: { [Op.in]: postIdArr },
        },
      }
    );
    return changeImage;
  };
  //닉네임을 받아 User 테이블에 중복된 닉네임이 있는지 찾는 함수
  checkNick = async (nickname) => {
    const checkNick = await User.findOne({ where: { nickname } });

    return checkNick;
  };
  //이메일, 닉네임, 프로필 이미지, provider를 받아 회원가입을 하는 함수
  signUp = async (email, nickname, image, provider, consonant) => {
    const signUp = await User.create({
      email,
      nickname,
      consonant,
      provider,
      image,
    });
    this.emailService.welcomeSend(email);
    return signUp;
  };
  //유저아이디를 받아 해당 유저를 회원탈퇴시키는 함수
  deleteUser = async (userId) => {
    const deleteUser = await User.destroy({ where: { userId } });
    return deleteUser;
  };
  //유저아이디를 받아 해당 유저의 런닝 기록을 리턴하는 함수
  getUserInfo = async (userId) => {
    const getUserInfo = await Record.findOne({
      where: { userId },
    });
    const userInfo = await User.findOne({ where: { userId } });

    return {
      goal: getUserInfo.goal,
      distance: getUserInfo.distance,
      time: getUserInfo.time,
      percent: getUserInfo.percent,
      weekOfDistance: getUserInfo.weekOfDistance,
      weekOfTime: getUserInfo.weekOfTime,
      profile: userInfo.image,
    };
  };
  getUserProfileInfo = async (userId) => {
    const getInfo = await User.findOne({ where: { userId } });
    return getInfo;
  };
  //유저 랭킹을 조회하기 위해 달린 거리를 기준으로 상위 5명의 닉네임과 프로필 이미지를 리턴하는 함수
  getRank = async () => {
    const getRank = await Record.findAll({
      limit: 5,
      order: [["distance", "DESC"]],
    });

    const userArr = [];
    for (let i = 0; i < getRank.length; i++) {
      userArr.push(getRank[i].userId);
    }

    const userInfo = await User.findAll({
      where: {
        userId: { [Op.in]: userArr },
      },
      attributes: ["nickname", "image"],
    });

    for (let i = 0; i <= 3; i++) {
      console.log("유저아이디", getRank[i].userId);
      console.log("유저닉네임", userInfo[i].nickname);
    }

    return Promise.all(
      getRank.map(async (test) => {
        const nick = await User.findOne({ where: { userId: test.userId } });
        const nickName = nick.nickname;
        const prof = await User.findOne({ where: { userId: test.userId } });
        const proFile = prof.profile;

        return {
          distance: test.distance,
          time: test.time,
          userId: test.userId,
          nickname: nickName,
          profile: proFile,
        };
      })
    );
  };
  //유저가 런닝을 할 때 실시간 위치를 불러오기 위해 5초마다 위도와 경도를 받아 계산후 이동한 거리를 리턴하는 함수
  sendLocation = async (userId, lat, lng) => {
    let arrLat = [];
    let arrLng = [];

    await redisClient.v4.lPush(`${userId}Lat`, `${lat}`);
    await redisClient.v4.lPush(`${userId}Lng`, `${lng}`);
    arrLat = await redisClient.v4.lRange(`${userId}Lat`, 0, 1);
    arrLng = await redisClient.v4.lRange(`${userId}Lng`, 0, 1);
    if (arrLat.length < 2) {
      return 0;
    } else if (arrLat.length >= 2) {
      let radLat1 = (Math.PI * arrLat[0]) / 180;
      let radLat2 = (Math.PI * arrLat[1]) / 180;
      let theta = arrLng[0] - arrLng[1];
      let radTheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radLat1) * Math.sin(radLat2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515 * 1.609344 * 1000;
      if (dist < 100) dist = Math.round(dist / 10) * 10;
      else dist = Math.round(dist / 100) * 100;

      return dist;
    }
  };
  //설문 조사 팝업 창을 유저가 로그인했을 때 보여주기 위한 함수
  getResearch = async (userId) => {
    let arrayId = [];

    arrayId = await redisClient.v4.sendCommand(["SMEMBERS", "Id"]);
    let test = arrayId.find((data) => {
      return data == userId;
    });
    if (test) {
      return { result: true };
    } else {
      return { result: false };
    }
  };
  //유저가 설문 조사 팝업 창을 1주일간 안보기를 눌렀을 때 1주일동안 보여주지 않기 위한 함수
  changeResearch = async (userId) => {
    await redisClient.v4.sAdd("Id", `${userId}`);
    await redisClient.v4.expire("Id", 604800);
    return "동의하기를 눌렀습니다.";
  };
  sendBugReport = async (nickname, content) => {
    emailService.bugReportSend(nickname, content);
    return "감사합니다. 관리자에게 메일을 성공적으로 보냈습니다.";
  };
  sendPostReport = async (nickname, postId, check) => {
    emailService.postReportSend(nickname, postId, check);
    return "감사합니다. 성공적으로 게시글을 신고하였습니다.";
  };
  startBtn = async (userId) => {
    await redisClient.v4.DEL(`${userId}Lat`);
    await redisClient.v4.DEL(`${userId}Lng`);
  };
}

module.exports = UserRepositiory;
