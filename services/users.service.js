const UserRepositiory = require("../repositories/users.repository");

class UserService{
    userRepositiory = new UserRepositiory();

    createUser = async(email, nickname, image, provider) => {
        const createUserData = await this.userRepositiory.createUser(email, nickname, image, provider);

        return createUserData;
    };

    duplicateCheck = async(nickname) => {
        const duplicateCheckData = await this.userRepository.duplicateCheck(nickname);

        return duplicateCheckData;
    };

    updateUser = async(email, nickname, image, provider) => {
        const updateUserData = await this.userRepositiory.updateUser(email, nickname, image, provider);
        
        return updateUserData;
    };
};

module.exports = UserService;