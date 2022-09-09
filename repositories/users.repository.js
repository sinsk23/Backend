const {User} = require("../models");

class UserRepositiory {
    createUser = async(email, nickname, image, provider) => {
        const users = await User.create({email, nickname, image, provider});
        return users;
    };

    duplicateCheck = async(nickname) => {
        const users = await User.findOne({where: {nickname}});
        return users;
    };

    updateUser = async(email, nickname, image, provider) => {
        const users = await User.update({nickname, image},{where: {email, provider}});
        return users;
    };
};

module.exports = UserRepositiory;