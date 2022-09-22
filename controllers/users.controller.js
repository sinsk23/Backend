require("dotenv").config();
const UserService = require("../services/users.service");
const jwt = require("jsonwebtoken");

const log = require("../winston");

const BadRequestError = require("./http-errors").BadRequestError;

class UserController {
  userService = new UserService();

  //클라이언트로부터 유저아이디, 거리, 시간을 받아 userService.addDistance()으로 유저아이디, 거리, 시간을 넘기는 함수
  addDistance = async (req, res, next) => {
    try {
      const { distance, time } = req.body;
      const { user } = res.locals;
      if (!distance) {
        log.error("UserController.addDistance : distance is required");
        throw new BadRequestError(
          "UserController.addDistance : distance is required"
        );
      }

      await this.userService.addDistance(user.userId, distance, time);
      res.status(200).json({ result: true, message: "거리를 등록하였습니다." });
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 닉네임, pagenum을 받아 userService.getUserPost()으로 닉네임, pagenum을 넘기는 함수
  getUserPost = async (req, res, next) => {
    try {
      const { nickname, pagenum } = req.params;
      const { user } = res.locals;

      let type = false;
      const getUserPost = await this.userService.getUserPost(
        nickname,
        pagenum,
        user.userId
      );
      if (!getUserPost.length) {
        type = true;
      }
      res.status(200).json({ Post: getUserPost, isLast: type });
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 닉네임을 받아 userService.serchUser()으로 닉네임을 넘기는 함수
  searchUser = async (req, res, next) => {
    try {
      const { nickname } = req.query;

      const searchUser = await this.userService.searchUser(nickname);
      return res.status(200).json(searchUser);
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 이메일, 닉네임, 프로필이미지, provider를 받아 userService.signUp()으로 이메일, 닉네임, 프로필이미지, provider를 넘기는 함수
  signUp = async (req, res, next) => {
    try {
      const { email, nickname, image, provider } = req.body;

      const signUp = await this.userService.signUp(
        email,
        nickname,
        image,
        provider
      );

      if (signUp) {
        const token = jwt.sign(
          {
            email,
            nickname,
            image,
            provider,
            userId: signUp.userId,
          },
          process.env.MYSECRET_KEY,
          {
            expiresIn: "2d",
          }
        );
        return res.status(200).json({
          token,
          image,
          email,
          provider,
          nickname,
          userId: signUp.userId,
          member: true,
          message: "success",
        });
      }
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 닉네임을 받아 userService.checkNick()으로 닉네임을 넘기는 함수
  checkNick = async (req, res, next) => {
    try {
      const { nickname } = req.query;
      const checkNick = await this.userService.checkNick(nickname);
      if (!checkNick) {
        return res.status(200).json({ duplicate: false });
      }
      res.status(200).json({ duplicate: true });
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 유저아이디, 목표를 받아 userService.setGoal()으로 유저아이디, 목표를 넘기는 함수
  setGoal = async (req, res, next) => {
    try {
      const { goal } = req.body;
      const { user } = res.locals;

      const setGoal = await this.userService.setGoal(goal, user.userId);
      res.status(200).json(setGoal);
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 유저아이디, 목표를 받아 userService.changeGoal()으로 유저아이디, 목표를 넘기는 함수
  changeGoal = async (req, res, next) => {
    try {
      const { goal } = req.body;
      const { user } = res.locals;

      const changeGoal = await this.userService.changeGoal(goal, user.userId);
      res.status(200).json(changeGoal);
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 유저아이디를 userService.checkGoal()으로 유저아이디를 넘기는 함수
  checkGoal = async (req, res, next) => {
    try {
      const { user } = res.locals;

      const checkGoal = await this.userService.checkGoal(user.userId);
      if (checkGoal) {
        res.status(200).json({ goal: true });
      } else {
        res.status(200).json({ goal: false });
      }
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 유저아이디, 프로필 이미지를 받아 userService.changeImage()으로 유저아이디, 프로필을 넘기는 함수
  changeImage = async (req, res, next) => {
    try {
      const { image } = req.body;
      const { user } = res.locals;
      const changeImage = await this.userService.changeImage(
        image,
        user.userId
      );
      res.status(200).json(changeImage);
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 유저아이디를 받아 userService.deleteUser()으로 유저아이디를 넘기는 함수
  deleteUser = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const deleteUser = await this.userService.deleteUser(user.userId);
      res.status(200).json(deleteUser);
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 유저아이디를 받아 userService.getUserInfo()로 유저아이디를 넘기는 함수
  getUserInfo = async (req, res, next) => {
    try {
      const { userId } = req.params;

      const getUserInfo = await this.userService.getUserInfo(userId);
      if (!getUserInfo) {
        res.status(200).json({ result: false });
      }
      res.status(200).json({ getUserInfo, result: true });
    } catch (error) {
      next(error);
    }
  };
  //userService.getRank()를 호출하는 함수
  getRank = async (req, res, next) => {
    try {
      const getRank = await this.userService.getRank();
      res.status(200).json(getRank);
    } catch (error) {
      next(error);
    }
  };
  //클라인터르로부터 유저아이디, 위도와 경도를 받아 userService.sendLocation()로 유저아이디, 위도, 경도를 넘기는 함수
  sendLocation = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { lat, lng } = req.body;
      const sendLocation = await this.userService.sendLocation(
        user.userId,
        lat,
        lng
      );
      res.status(200).json(sendLocation);
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 유저아이디를 받아 userService.getResearch()로 유저아이디를 넘기는 함수
  getResearch = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const getResearch = await this.userService.getResearch(user.userId);
      res.status(200).json(getResearch);
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 유저아이디를 받아 userService.changeResearch()로 유저아이디를 넘기는 함수
  changeResearch = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const changeResearch = await this.userService.changeResearch(user.userId);
      res.status(200).json(changeResearch);
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 유저닉네임과 작성 내용을 받아 userService.sendBugReport()로 유저닉네임, 작성 내용을 넘기는 함수
  sendBugReport = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { content } = req.body;
      const sendBugReport = await this.userService.sendBugReport(
        user.nickname,
        content
      );
      res.status(200).json(sendBugReport);
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 유저닉네임과 게시글 아이디, 체크를 받아 userService.sendPostReport()로 유저닉네임, 게시글 아이디, 체크를 넘기는 함수
  sendPostReport = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { postId } = req.params;
      const { check } = req.body;
      await this.userService.sendPostReport(user.nickname, postId, check);
      res.status(200).json("성공적으로 게시글을 신고하였습니다.");
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 유저아이디를 받아 userService.startBtn()으로 유저아이디를 넘기는 함수
  startBtn = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const startBtn = await this.userService.startBtn(user.userId);
      res.status(200).json(startBtn);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
