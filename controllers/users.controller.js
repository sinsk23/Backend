const UserService = require("../services/users.sevice");

class UserController {
  userService = new UserService();

  addDistance = async (req, res, next) => {
    try {
      console.log("????????????");
      const { distance } = req.body;
      const { userId } = req.body;
      console.log(distance, userId);
      const addDistance = await this.userService.addDistance(userId, distance);
      res.status(201).json(addDistance);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
