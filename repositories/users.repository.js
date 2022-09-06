const { Record } = require("../models");
class UserRepository {
  addDistance = async (userId, distance) => {
    const addDistance = await Record.create({ userId, distance });
    return addDistance;
  };
}

module.exports = UserRepository;
