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

        goal: {
          type: Sequelize.FLOAT,
          defaultValue: 0,
          allowNull: true,
        },
        distance: {
          type: Sequelize.FLOAT,
          defaultValue: 0,
          allowNull: true,
        },
        time: {
          type: Sequelize.FLOAT,
          defaultValue: 0,
          allowNull: true,
        },
        percent: {
          type: Sequelize.FLOAT,
          defaultValue: 0,
          allowNull: true,
        },
        weekOfDistance: {
          type: Sequelize.JSON,
          defaultValue: [0, 0, 0, 0, 0, 0, 0],

          allowNull: true,
        },
        weekOfTime: {
          type: Sequelize.JSON,
          defaultValue: [0, 0, 0, 0, 0, 0, 0],

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
    db.Record.belongsTo(db.User, {
      foreignKey: "userId",

      targetKey: "userId",

      onDelete: "CASCADE",
    });
  }
};
