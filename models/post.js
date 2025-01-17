const Sequelize = require("sequelize");

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        postId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        nickname: {
          type: Sequelize.TEXT,
          allowNull: false,
        },

        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        time: {
          type: Sequelize.JSON,
          defaultValue: [],

          allowNull: true,
        },
        distance: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: true,
        },
        path: {
          type: Sequelize.JSON,
          defaultValue: [],
          allowNull: true,
        },
        speed: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: true,
        },
        like: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: true,
        },
        view: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: true,
        },

        image: {
          type: Sequelize.JSON,
          defaultValue: [],
        },
        hashtag: {
          type: Sequelize.JSON,
          defaultValue: [],
        },
        likeDone: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.hasMany(db.Like, {
      foreignKey: "postId",
      sourceKey: "postId",
      onDelete: "CASCADE",
    });
    db.Post.hasMany(db.Hashtag, {
      foreignKey: "postId",
      sourceKey: "postId",
      onDelete: "CASCADE",
    });
    db.Post.hasMany(db.Comment, {
      foreignKey: "postId",
      sourceKey: "postId",
      onDelete: "CASCADE",
    });

    /*db.Post.belongsTo(db.User, {
      foreignKey: "userId",
      targetKey: "userId",
      onDelete: "CASCADE",
      onDelete: "CASCADE",
    });*/
  }
};
