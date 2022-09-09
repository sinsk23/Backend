const UserService = require("../services/users.service");

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
};

module.exports = UserController;