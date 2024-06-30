module.exports = (sequelize, DataTypes) => {
  return sequelize.define("meetings", {
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      isEmail: true,
      allowNull: true,
    },
    alloted_HR: {
      type: DataTypes.STRING,
      isEmail: true,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    application_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meeting_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hr_phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    end_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    process_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    meeting_link: {
      type: DataTypes.TEXT,
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
