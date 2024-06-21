module.exports = (sequelize, DataTypes) => {
    const resume= sequelize.define( "resume", {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false, 
        }, 
        resume_title: {
            type: DataTypes.STRING, // Example: Define other columns as needed
            allowNull: true,
        },
        photo: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        resume_category: {
            type: DataTypes.STRING,
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
        }, {timestamps:false} );
    return resume;
  };