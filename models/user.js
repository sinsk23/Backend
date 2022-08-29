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
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        nickname: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: true,
        },
        profile: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
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
