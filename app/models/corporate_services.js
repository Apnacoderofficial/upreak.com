module.exports = (sequelize, DataTypes) => {
    return sequelize.define('corporate_services', {
        service_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        partner_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        service_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        service_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        service_price: {
            type: DataTypes.STRING,
            allowNull: true
        },
        photo: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        service_status: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true, // Use snake_case for column names
    });
};
