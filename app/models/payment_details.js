module.exports = (sequelize, DataTypes) => {
  return sequelize.define("payment_details", {
    name: {

      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      isEmail: true,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentModes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    utr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    merchantTransactionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payer_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    merchantId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payment_time: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    providerReferenceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    credit: {
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
  }, { 
    timestamps: false 
  });
};