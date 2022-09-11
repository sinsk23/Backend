const Sequelize = require("sequelize");

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        commentId: {
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
        modelName: "Comment",
        tableName: "comments",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Comment.belongsTo(db.Post, {
      foreignKey: "postId",
      targetKey: "postId",
  
      onDelete: "CASCADE",
    });
    db.Comment.belongsTo(db.User, {
      
      foreignKey: "userId",


      targetKey: "userId",

      onDelete: "CASCADE",
    });
    db.Comment.hasMany(db.ReComment, {
      foreingKey: "userId",
      foreignKey: "commentId",
    });
  }
};
