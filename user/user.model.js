const { DataTypes } = require("sequelize");

module.exports = model;

function model(sequelize) {
  const attributes = {
    userName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    height: { type: DataTypes.DOUBLE, allowNull: false },
    weight: { type: DataTypes.DOUBLE, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  };
  const options = {
    defaultScope: {
      // exclude hash by default
      attributes: { exclude: ["hash"] },
    },
    scopes: {
      //include hash with this scope
      withHash: { attributes: {} },
    },
  };

  return sequelize.define("user", attributes, options);
}
