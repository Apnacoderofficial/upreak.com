module.exports = (sequelize, DataTypes) => {
  return sequelize.define("activity_logs", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, // Validate that the mail field is an email address
      },
    },
    admin_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activity: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    // Other model options go here
    timestamps: true, // Enable timestamps (createdAt and updatedAt)
    underscored: true, // Use snake_case for column names
  });
};
