const Sequelize = require("sequelize");

module.exports = class ReComment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        recommentId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },

        comment: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "ReComment",
        tableName: "recomments",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.ReComment.belongsTo(db.Comment, {
      foreignKey: "userId",
      foreignKey: "commentId",

      targetKey: "userId",
      targetKey: "commentId",
      onDelete: "CASCADE",
    });
  }
};
