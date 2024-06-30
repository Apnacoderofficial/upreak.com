module.exports = (sequelize, DataTypes) => {
  return sequelize.define("testimonials", {
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
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
  }, {
    timestamps: false
  });
};
