const { Record, Post, Like, User } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const mailer = require("../node-mailer");
const help = require("korean-regexp");
const day = require("../node-scheduler");

const dotenv = require("dotenv");
const redis = require("redis");

dotenv.config(); // env환경변수 파일 가져오기

//* Redis 연결
// redis[s]://[[username][:password]@][host][:port][/db-number]
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true, // 반드시 설정 !!
});
redisClient.on("connect", () => {
  console.info("Redis connected!");
});
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});
redisClient.connect().then(); // redis v4 연결 (비동기)
const redisCli = redisClient.v4; // 기본 redisClient 객체는 콜백기반인데 v4버젼은 프로미스 기반이라 사용

class UserRepositiory {
  emailService = new mailer();
  addDistance = async (userId, distance, time) => {
    await redisCli.set("test", "12345");
    const test = await redisCli.get("test");
    console.log("테스트", test);
    const getUserRecord = await Record.findOne({ where: { userId } });
    let percent = 0;
    let getDistance = Number(getUserRecord.distance + distance);
    percent = getDistance / getUserRecord.goal;

    let weekOfDistance = getUserRecord.weekOfDistance;
    let weekOfTime = getUserRecord.weekOfTime;
    weekOfDistance[day.day] += distance;
    weekOfTime[day.day] += time;
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
  checkGoal = async (userId) => {
    console.log("유저아이디", userId);
    const checkGoal = await Record.findOne({ where: { userId } });

    return checkGoal;
  };
  changeImage = async (image, userId) => {
    const changeImage = await User.update({ image }, { where: { userId } });
    const findId = await Post.findAll({ where: { userId } });
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
  sendLocation = async () => {
    const sendLocation = "test";
    return sendLocation;
  };
}

module.exports = UserRepositiory;
