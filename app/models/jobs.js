module.exports = (sequelize, DataTypes) => {
    return sequelize.define("jobs", {
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        sub_heading: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        job_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        job_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        heading: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        company_size: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        website: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        relocation: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        experience: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        vacancy: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        photo: {
            type: DataTypes.BLOB,
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
    }, {
        timestamps: false
    });
};
