module.exports = (sequelize, DataTypes) => {
  const Industry = sequelize.define("Industry", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '0', // Set default status as a string
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    timestamps: true, // Enable automatic createdAt and updatedAt
    createdAt: 'createdAt', // Optional: rename columns if needed
    updatedAt: 'updatedAt'
  });

  return Industry;
};
