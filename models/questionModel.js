module.exports = (sequelize, DataTypes) => {
  const ViewerQuestion = sequelize.define( "questions", {
      question: { 
          type: DataTypes.STRING,
          allowNull: false,
      }, 
      type: { 
        type: DataTypes.STRING,
        allowNull: false,
    }, 
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false, 
  }, 

    important: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
},
remarks: {
  type: DataTypes.STRING,
  allowNull: true,
},
      order_id: {
        type: DataTypes.INTEGER,
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
  return ViewerQuestion;
};
