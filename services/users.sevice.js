const UserRepository = require("../repositories/users.repository");

class UserService {
  userRepository = new UserRepository();
  addDistance = async (userId, distance) => {
    const addDistance = await this.userRepository.addDistance(userId, distance);
    return addDistance;
  };
}
module.exports = UserService;
