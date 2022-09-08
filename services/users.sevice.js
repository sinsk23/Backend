const UserRepository = require("../repositories/users.repository");
const log = require("../winston");
let BadRequestError = require("./http-errors").BadRequestError;
class UserService {
  userRepository = new UserRepository();
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
  changeProfile = async (profile, userId) => {
    const changeProfile = await this.userRepository.changeProfile(
      profile,
      userId
    );
    return changeProfile;
  };
}
module.exports = UserService;
