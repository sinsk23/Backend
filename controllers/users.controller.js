require("dotenv").config();
const UserService = require("../services/users.service");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const log = require("../winston");

let BadRequestError = require("./http-errors").BadRequestError;

class UserController {
  userService = new UserService();

  addDistance = async (req, res, next) => {
    try {
      const { distance } = req.body;
      const { user } = res.locals;
      if (!distance) {
        log.error("UserController.addDistance : distance is required");
        throw new BadRequestError(
          "UserController.addDistance : distance is required"
        );
      }

      const addDistance = await this.userService.addDistance(
        user.userId,
        distance
      );
      res.status(200).json({ result: true, message: "거리를 등록하였습니다." });
    } catch (error) {
      next(error);
    }
  };
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
  searchUser = async (req, res, next) => {
    try {
      const { nickname } = req.query;

      const searchUser = await this.userService.searchUser(nickname);
      res.status(200).json(searchUser);
    } catch (error) {
      next(error);
    }
  };
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
  checkNick = async (req, res, next) => {
    const { nickname } = req.query;
    const checkNick = await this.userService.checkNick(nickname);
    if (!checkNick) {
      return res.status(200).json({ duplicate: false });
    }
    res.status(200).json({ duplicate: true });
  };
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
  deleteUser = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const deleteUser = await this.userService.deleteUser(user.userId);
      res.status(200).json(deleteUser);
    } catch (error) {
      next(error);
    }
  };
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
}

module.exports = UserController;
