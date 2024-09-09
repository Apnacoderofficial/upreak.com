module.exports = (sequelize, DataTypes) => {
    const JobApplications = sequelize.define( "job_applications", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false, 
      }, 
      job_id: { 
        type: DataTypes.STRING,
        allowNull: true,
    }, 
      phone_number: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      name: { 
          type: DataTypes.STRING,
          allowNull: true,
      }, 
      email: { 
        type: DataTypes.STRING,
        allowNull: true,
        isEmail: true,
      },
      resume:{ 
        type: DataTypes.BLOB,
        allowNull: true,
      },
      resume_link: {
        type: DataTypes.JSON,
        allowNull: true,
    },
      status: { 
        type: DataTypes.INTEGER,
        allowNull: true,
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
    }, 
    { timestamps : false });
    return JobApplications;
  };