module.exports = (sequelize, DataTypes) => {
    const Partner = sequelize.define( "mou_registration", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        shortname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            isEmail: true,
            allowNull: false,
        },
        number: { 
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
        qr: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: { 
          type: DataTypes.STRING,
          allowNull: false,
        },
        college: { 
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: { 
            type: DataTypes.STRING,
            allowNull: false,
        },
        facebook: { 
            type: DataTypes.STRING,
            allowNull: true,

        },
        instagram: { 
            type: DataTypes.STRING,
            allowNull: true,

        },
        twitter: { 
            type: DataTypes.STRING,
            allowNull: true,

        },
        linkedin: { 
            type: DataTypes.STRING,
            allowNull: true,
        },
        youtube: { 
            type: DataTypes.STRING,
            allowNull: true,
        },
        supportby: { 
            type: DataTypes.STRING,
            allowNull: true,
        },
        supportnumber: { 
            type: DataTypes.STRING,
            allowNull: true,

        },
        supportemail: { 
            type: DataTypes.STRING,
            allowNull: true,

        },
        thread: { 
            type: DataTypes.STRING,
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
    return Partner;
  };