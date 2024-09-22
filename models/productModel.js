module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define( "products", {
      name: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      description: { 
          type: DataTypes.STRING,
          allowNull: false,
      },
      link: {
          type: DataTypes.STRING,
          allowNull: false,
      },
       photo: {
          type: DataTypes.BLOB,
          allowNull: true,
      },
      price: { 
        type: DataTypes.STRING,
        allowNull: false,
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
  return Partner;
};