const Sequelize = require("sequelize");

module.exports = class Record extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        recordId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        goal: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: true,
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
        speed: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "record",
        tableName: "records",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    /*db.Hashtag.belongsTo(db.User, {
      foreignKey: "userId",

      targetKey: "userId",

      onDelete: "CASCADE",
    });*/
  }
};
