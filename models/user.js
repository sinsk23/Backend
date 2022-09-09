const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        email: {
          type: Sequelize.STRING(40),
          allowNull: true, //카카오 정책 변경으로 인한 false->true로 변경
          unique: true,
        },

        nickname: {
          type: Sequelize.STRING(15),
          allowNull: true,
          unique: true,
        },

        image: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        //sns로그인을 하였을 경우 provider와 snsId를 저장
        // //provider가 local이면 로컬 로그인을, kakao면 카카오 로그인을 한것
        provider: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: "local",
        }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post, { foreignKey: "userId", sourceKey: "userId" });
  }
};
