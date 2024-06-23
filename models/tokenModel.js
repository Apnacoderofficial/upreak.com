module.exports = (sequelize, DataTypes) => {
    const TokenData = sequelize.define("tokendata", {
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
    }, { timestamps: false });
  
    return TokenData;
  };
  