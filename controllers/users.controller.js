require("dotenv").config();
const UserService = require("../services/users.service");

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
      res.status(201).json(addDistance);
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
      const { email, nickname, image } = req.body;

      const signUp = await this.userService.signUp(email, nickname, image);

      res.status(200).json(signUp);
    } catch (error) {
      next(error);
    }
  };
  checkNick = async (req, res, next) => {
    const { nickname } = req.body;
    const checkNick = await this.userService.checkNick(nickname);
    res.status(200).json(checkNick);
  };
  setGoal = async (req, res, next) => {
    try {
      const { goal, userId } = req.body;
      const setGoal = await this.userService.setGoal(goal, userId);
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
}

module.exports = UserController;
