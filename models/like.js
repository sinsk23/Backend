const Sequelize = require("sequelize");

module.exports = class Like extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        likeId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Like",
        tableName: "likes",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Like.belongsTo(db.Post, {
      foreignKey: "postId",
      targetKey: "postId",
      onDelete: "CASCADE",
    });
    db.Like.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "userId",
      onDelete: "CASCADE",
    });
  }
};
