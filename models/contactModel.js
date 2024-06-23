module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define( "contactus", {
      name: {
          type: DataTypes.STRING,
          allowNull: true,
      },
	subject: {
          type: DataTypes.STRING,
          allowNull: true,
      },
      email: {
          type: DataTypes.STRING,
          isEmail: true,
          allowNull: true,
      },
      message: { 
          type: DataTypes.TEXT,
          allowNull: true,
      },
      category: { 
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
  }, {timestamps:false} );
  return Contact;
};
