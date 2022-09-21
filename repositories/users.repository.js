const { Record, Post, Like, User } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

require("dotenv").config;
const mailer = require("../node-mailer");
const help = require("korean-regexp");
const day = require("../node-scheduler");
const redis = require("redis");

const emailService = new mailer();
// redis 연결
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true,
});

redisClient.on("connect", () => console.info("🟢 Redis 연결 성공!"));
redisClient.on("error", (err) =>
  console.error("Redis Client Error", err.message)
);

redisClient.connect();

class UserRepositiory {
  emailService = new mailer();
  addDistance = async (userId, distance, time) => {
    await redisClient.v4.DEL(`${userId}Lat`);
    await redisClient.v4.DEL(`${userId}Lng`);
    const getUserRecord = await Record.findOne({ where: { userId } });
    let percent = 0;
    let getDistance = Number(getUserRecord.distance + distance);
    percent = getDistance / getUserRecord.goal;

    let weekOfDistance = getUserRecord.weekOfDistance;
    let weekOfTime = getUserRecord.weekOfTime;
    if (day.day === 0) {
      console.log("테스트");
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
  getPost = async (postId, userId) => {
    let isLike;
    if (userId) {
      isLike = await Like.findOne({ where: { userId, postId } });
      if (isLike) {
        await Post.update({ likeDone: true }, { where: { postId } });
      } else {
        await Post.update({ likeDone: false }, { where: { postId } });
      }
    } else {
      const countView = await Post.findOne({ where: { postId } });

      await Post.update({ view: countView.view + 1 }, { where: { postId } });
    }

    const getPost = await Post.findOne({ where: { postId } });

    return getPost;
  };

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
  setGoal = async (goal, userId) => {
    const setGoal = await Record.create({ goal, userId });
    return setGoal;
  };
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
  checkGoal = async (userId) => {
    console.log("유저아이디", userId);
    const checkGoal = await Record.findOne({ where: { userId } });

    return checkGoal;
  };
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
  checkNick = async (nickname) => {
    const checkNick = await User.findOne({ where: { nickname } });

    return checkNick;
  };

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
  deleteUser = async (userId) => {
    const deleteUser = await User.destroy({ where: { userId } });
    return deleteUser;
  };
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

    let i = -1;
    return getRank.map((test) => {
      i++;
      return {
        distance: test.distance,
        time: test.time,
        userId: test.userId,
        nickname: userInfo[i].nickname,
        profile: userInfo[i].image,
      };
    });
  };
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

      console.log("배열1", arrLat);
      console.log("배열2", arrLng);

      return dist;
    }
  };
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
