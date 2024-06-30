module.exports = (sequelize, DataTypes) => {
  return sequelize.define("blogs", {
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    heading: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metatitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metakeywords: {
      type: DataTypes.TEXT,
      allowNull: true,
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
      allowNull: false,
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