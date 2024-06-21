module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("Role", {
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
      permission_id: {
        type: DataTypes.STRING,
        allowNull: true,
      }, // it stores all the ids of sidebar table
      createdAt: {
        allowNull: true,
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATEONLY,
      },
    }, { timestamps: false });
  
    return Role;
  };
  