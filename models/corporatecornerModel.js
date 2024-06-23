module.exports = (sequelize, DataTypes) => {
    const corporateCorner = sequelize.define('corporatecorner', {
        partner_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        heading: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        subheading: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        company_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        company_category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        company_address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        company_description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        contact_person: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        photo: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        partner_status: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        timestamps: true, // Enable timestamps (createdAt, updatedAt)
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true, // Use snake_case for column names
        tableName: 'corporatecorner' // Table name in the database
    });

    return corporateCorner;
};
