const UserRepositiory = require("../repositories/users.repository");
const log = require("../winston");
const help = require("korean-regexp");
const { User } = require("../models");
let BadRequestError = require("./http-errors").BadRequestError;
class UserService {
  userRepository = new UserRepositiory();

  addDistance = async (userId, distance) => {
    const addDistance = await this.userRepository.addDistance(userId, distance);
    return addDistance;
  };
  getUserPost = async (nickname, pagenum, userId) => {
    if (!nickname) {
      log.error("UserController.getUserPost : nickname is required");
      throw new BadRequestError(
        "UserController.getUserPost : nickname is required"
      );
    }
    const getUserPost = await this.userRepository.getUserPost(
      nickname,
      pagenum
    );
    return Promise.all(
      getUserPost.map(async (post) => {
        const getPosts = await this.userRepository.getPost(post.postId, userId);

        return getPosts;
      })
    );
  };
  searchUser = async (nickname) => {
    if (!nickname) {
      log.error("UserController.searchUser : nickname is required");
      throw new BadRequestError(
        "UserController.searchUser : nickname is required"
      );
    }
    const searchUser = await this.userRepository.searchUser(nickname);
    return searchUser;
  };
  setGoal = async (goal, userId) => {
    const setGoal = await this.userRepository.setGoal(goal, userId);
    return setGoal;
  };
  changeImage = async (image, userId) => {
    const changeImage = await this.userRepository.changeImage(image, userId);
    return changeImage;
  };
  checkNick = async (nickname) => {
    const checkNick = await this.userRepository.checkNick(nickname);
    return checkNick;
  };
  signUp = async (email, nickname, image) => {
    if (!email || !nickname || !image) {
      log.error("UserService.signUp : email or nickname or image is required");
      throw new BadRequestError(
        "UserService.signUp : email or nickname or image is required"
      );
    }

    const checkEmail = await User.findOne({ where: { email } });

    const checkNick = await User.findOne({ where: { nickname } });

    if (checkEmail && email === checkEmail.email) {
      log.error("UserService.signUp : email is duplicated");
      throw new BadRequestError("UserService.signUp : email is duplicated");
    }

    if (checkNick && nickname === checkNick.nickname) {
      log.error("UserService.signUp : nickname is duplicated");
      return { nickCheck: false };
    }

    let consonant = [];
    consonant = help.explode(nickname).join("");
    const signUp = await this.userRepository.signUp(
      email,
      nickname,
      image,
      consonant
    );
    return signUp;
  };
  deleteUser = async (userId) => {
    const deleteUser = await this.userRepository.deleteUser(userId);
    return deleteUser;
  };
}

module.exports = UserService;
