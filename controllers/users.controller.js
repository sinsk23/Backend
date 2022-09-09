
require("dotenv").config();
const UserService = require("../services/users.sevice");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { User } = require("../models");
const log = require("../winston");
let BadRequestError = require("./http-errors").BadRequestError;
const help = require("korean-regexp");

class UserController {
    userService = new UserService();

    createUser = async(req, res, next) => {
        const {email, nickname, image, provider} = req.body;

        if (email === "" || email === "" || nickname ==="" || image === "" || provider === "")
        {
            return res.status(400).json({
                result: false,
                errorMessage: "빈 값이 존제합니다.",
              });
        };

        const createUserData = await this.userService.createUser(email, nickname, image, provider);

        if (!createUserData) {
            return res.status(400).json({
                result: false,
                errorMessage: "회원 가입에 실패하였습니다.",
              });
        };
    };

    duplicateCheck = async(req, res, next) => {
        const {nickname} = req.body;

        const duplicateCheckData = await this.userService.duplicateCheck(nickname);

        if (!duplicateCheckData) {
            return res.status(200).json({
                ok: true,
                Message: "닉네임이 중복이 아닙니다"
            });
        };

        res.status(400).json({
            ok: false,
            errorMessage: "닉네임이 중복입니다"
        });
    };

    updateUser = async(req, res, next) => {
        const {nickname, image} = req.body;
        const {email, provider} = res.locals.user;

        const updateUserData = await this.userService.updateUser(email, nickname, image, provider);

        if(!updateUserData) {
            return res.status(400).json({
                ok: false, 
                errorMessage: "회원 정보 수정 실패"
            });
        };

        res.status(200).json({
            ok: true,
            Message: "회원 정보 수정 완료"
        });
    };
    kakaologin = (req, res, next) => {
      passport.authenticate(
        "kakao",
        { failureRedirect: "/" },
        (err, user, info) => {
          if (err) return next(err);
          const { userId, nickname } = user;
  
          const token = jwt.sign({ userId, nickname }, process.env.MYSECRET_KEY, {
            expiresIn: "2d",
          });
          res.status(200).json({
            token,
            message: "success",
          });
        }
      )(req, res, next);
    };
  
    createAccount = async (req, res, next) => {
      const { nickname, profile } = req.body;
      const createUser = await User.create(nickname, profile);
      return res.status(201).json({ createUser });
    };
    addDistance = async (req, res, next) => {
      try {
        const { distance } = req.body;
        if (!distance) {
          log.error("UserController.addDistance : distance is required");
          throw new BadRequestError(
            "UserController.addDistance : distance is required"
          );
        }
        const { userId } = req.body;
        console.log(distance, userId);
        const addDistance = await this.userService.addDistance(userId, distance);
        res.status(201).json(addDistance);
      } catch (error) {
        next(error);
      }
    };
    getUserPost = async (req, res, next) => {
      try {
        const { nickname, pagenum } = req.params;
        const { userId } = req.body;
  
        let type = false;
        const getUserPost = await this.userService.getUserPost(
          nickname,
          pagenum,
          userId
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
        const { email, nickname, profile } = req.body;
        let consonant = [];
        consonant = help.explode(nickname).join("");
        const signUp = await User.create({ email, nickname, consonant, profile });
  
        res.status(200).json(signUp);
      } catch (error) {
        next(error);
      }
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
    changeProfile = async (req, res, next) => {
      try {
        const { profile, userId } = req.body;
        const changeProfile = await this.userService.changeProfile(
          profile,
          userId
        );
        res.status(200).json(changeProfile);
      } catch (error) {
        next(error);
      }
    };
};

module.exports = UserController;
