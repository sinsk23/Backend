const UserRepositiory = require("../repositories/users.repository");
const log = require("../winston");
const help = require("korean-regexp");
const { User, Record } = require("../models");
let BadRequestError = require("./http-errors").BadRequestError;
class UserService {
  userRepository = new UserRepositiory();

  addDistance = async (userId, distance, time) => {
    if (!distance) {
      log.error("UserController.addDistance : distance is required");
      throw new BadRequestError(
        "UserController.addDistance : distance is required"
      );
    }
    if (!time) {
      log.error("UserController.addDistance : time is required");
      throw new BadRequestError(
        "UserController.addDistance : time is required"
      );
    }
    const addDistance = await this.userRepository.addDistance(
      userId,
      distance,
      time
    );
    return addDistance;
  };

  getUserPost = async (nickname, pagenum, userId) => {
    if (!nickname) {
      log.error("UserController.getUserPost : nickname is required");
      throw new BadRequestError(
        "UserController.getUserPost : nickname is required"
      );
    }
    if (!pagenum) {
      log.error("UserController.getUserPost : pagenum is required");
      throw new BadRequestError(
        "UserController.getUserPost : pagenum is required"
      );
    }
    if (!userId) {
      log.error("UserController.getUserPost : userId is required");
      throw new BadRequestError(
        "UserController.getUserPost : userId is required"
      );
    }
    const getUserPost = await this.userRepository.getUserPost(
      nickname,
      pagenum
    );
    const Id = await User.findOne({ where: { nickname } });
    return Promise.all(
      getUserPost.map(async (post) => {
        const getPosts = await this.userRepository.getPost(post.postId, Id);

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
    const checkUser = await Record.findOne({ where: { userId } });
    if (checkUser) {
      log.error("UserService.setGoal : goal is already declared");
      throw new BadRequestError(
        "UserService.setGoal : goal is already declared"
      );
    }
    const setGoal = await this.userRepository.setGoal(goal, userId);
    return setGoal;
  };
  changeGoal = async (goal, userId) => {
    const changeGoal = await this.userRepository.changeGoal(goal, userId);
    return changeGoal;
  };
  checkGoal = async (userId) => {
    if (!userId) {
      log.error("UserService.checkGoal : userId is required");
      throw new BadRequestError("UserService.checkGoal : userId is required");
    }
    const checkGoal = await this.userRepository.checkGoal(userId);
    return checkGoal;
  };
  changeImage = async (image, userId) => {
    const changeImage = await this.userRepository.changeImage(image, userId);
    return changeImage;
  };
  checkNick = async (nickname) => {
    if (!nickname) {
      log.error("UserController.checkNick : nickname is required");
      throw new BadRequestError(
        "UserController.checkNick: nickname is required"
      );
    }
    const checkNick = await this.userRepository.checkNick(nickname);
    return checkNick;
  };
  signUp = async (email, nickname, image, provider) => {
    if (!email || !nickname) {
      log.error("UserService.signUp : email or nickname is required");
      throw new BadRequestError(
        "UserService.signUp : email or nickname is required"
      );
    }

    const checkEmail = await User.findAll({ where: { email } });
    const checkNick = await User.findOne({ where: { nickname } });
    const checkProvider = await User.findOne({ where: { provider } });
    for (let i = 0; i < checkEmail.length; i++) {
      if (checkEmail && email === checkEmail[i].email) {
        if (checkProvider && provider === checkEmail[i].provider) {
          log.error("UserService.signUp : provider is duplicated");
          throw new BadRequestError(
            "UserService.signUp : provider is duplicated"
          );
        }
      }
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
      provider,
      consonant
    );

    return signUp;
  };
  deleteUser = async (userId) => {
    if (!userId) {
      log.error("UserService.deleteUser : userId is required");
      throw new BadRequestError("UserService.deleteUser: userId is required");
    }
    const deleteUser = await this.userRepository.deleteUser(userId);
    return deleteUser;
  };
  getUserInfo = async (userId) => {
    if (!userId) {
      log.error("UserService.getUserInfo : userId is required");
      throw new BadRequestError("UserService.getUserInfo: userId is required");
    }
    const getUserInfo = await this.userRepository.getUserInfo(userId);
    return getUserInfo;
  };
  getUserProfileInfo = async (userId) => {
    if (!userId) {
      log.error("UserService.getUserProfileInfo : userId is required");
      throw new BadRequestError(
        "UserService.getUserProfileInfo: userId is required"
      );
    }
    const getUserInfo = await this.userRepository.getUserProfileInfo(userId);
    return getUserInfo;
  };
  getRank = async () => {
    const getRank = await this.userRepository.getRank();
    return getRank;
  };
  sendLocation = async (userId, lat, lng) => {
    if (!userId) {
      log.error("UserService.sendLocation : userId is required");
      throw new BadRequestError("UserService.sendLocation: userId is required");
    }
    if (!lat) {
      log.error("UserService.sendLocation : lat is required");
      throw new BadRequestError("UserService.sendLocation: lat is required");
    }
    if (!lng) {
      log.error("UserService.sendLocation : lng is required");
      throw new BadRequestError("UserService.sendLocation: lng is required");
    }
    const sendLocation = await this.userRepository.sendLocation(
      userId,
      lat,
      lng
    );
    return sendLocation;
  };
  getResearch = async (userId) => {
    if (!userId) {
      log.error("UserService.getResearch : userId is required");
      throw new BadRequestError("UserService.getResearch: userId is required");
    }
    const getResearch = await this.userRepository.getResearch(userId);
    return getResearch;
  };
  changeResearch = async (userId) => {
    if (!userId) {
      log.error("UserService.changeResearch : userId is required");
      throw new BadRequestError(
        "UserService.changeResearch: userId is required"
      );
    }
    const changeResearch = await this.userRepository.changeResearch(userId);
    return changeResearch;
  };
  sendBugReport = async (nickname, content) => {
    if (!nickname) {
      log.error("UserService.sendBugReport : nickname is required");
      throw new BadRequestError(
        "UserService.sendBugReport: nickname is required"
      );
    }
    if (!content) {
      log.error("UserService.sendBugReport : content is required");
      throw new BadRequestError(
        "UserService.sendBugReport: content is required"
      );
    }
    const sendBugReport = await this.userRepository.sendBugReport(
      nickname,
      content
    );
    return sendBugReport;
  };
  sendPostReport = async (nickname, postId, check) => {
    if (!nickname) {
      log.error("UserService.sendPostReport : nickname is required");
      throw new BadRequestError(
        "UserService.sendPostReport: nickname is required"
      );
    }
    if (!postId) {
      log.error("UserService.sendPostReport : postId is required");
      throw new BadRequestError(
        "UserService.sendPostReport: postId is required"
      );
    }
    if (!check) {
      log.error("UserService.sendPostReport : check is required");
      throw new BadRequestError(
        "UserService.sendPostReport: check is required"
      );
    }
    const sendPostReport = await this.userRepository.sendPostReport(
      nickname,
      postId,
      check
    );
    return sendPostReport;
  };
  startBtn = async (userId) => {
    if (!userId) {
      log.error("UserService.startBtn : userId is required");
      throw new BadRequestError("UserService.startBtn: userId is required");
    }
    const startBtn = await this.userRepository.startBtn(userId);
    return startBtn;
  };
}

module.exports = UserService;
