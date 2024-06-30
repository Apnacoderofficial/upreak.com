module.exports = (sequelize, DataTypes) => {
  return sequelize.define("dash_logins", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    googleid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      isEmail: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phonenumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdby: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    two_step: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    createdAt: {
      allowNull: true,
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
  },{ 
    timestamps: false 
  });
};
