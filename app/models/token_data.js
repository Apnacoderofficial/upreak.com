module.exports = (sequelize, DataTypes) => {
  return sequelize.define("token_data", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    timestamps: false
  });
};
