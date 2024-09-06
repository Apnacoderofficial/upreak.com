module.exports = (sequelize, DataTypes) => {
    const AssessmentReport = sequelize.define("assessmentreports", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      meeting_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      candidateid: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      interviewername: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      candidatename: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      candidateemail: {
        type: DataTypes.STRING,
        allowNull: true,
        isEmail: true,
      },
      candidatephone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      collegename: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      interviewpreparedness: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      confidencenervousness: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nonverbalcommunication: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      industryspecific: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      projectmanagement: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      comments: {
        type: DataTypes.TEXT ,
        allowNull: true,
      },
      verbalcommunication: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      teamwork: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      computerproficiency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      enthusiasmmotivation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      timemanagement: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      worklifebalance: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      achievementsaccomplishments: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fresherexperienced: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    }, { timestamps: false });
  
    return AssessmentReport;
  };
  