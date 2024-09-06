module.exports = (sequelize, DataTypes) => {
    const CandidateDetails = sequelize.define( "candidate_details", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false, 
      }, 
      phonenumber: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      urole: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      application_id: { 
        type: DataTypes.STRING,
        allowNull: true,   
      }, 
      whatsappnumber: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
        name: { 
          type: DataTypes.STRING,
          allowNull: true,
      }, 
      emailid: { 
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        isEmail: true,
      },
      marragestatus:  { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      area:  { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      city:  { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      state:  { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      pincode:  { 
        type: DataTypes.STRING,
        allowNull: true,
      },
  
      dob: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      gender: { 
        type: DataTypes.STRING,
        allowNull: true,
        }, 
      qualification_10:  { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      university_10: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      ctype_10: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      percent_10: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      yos_10: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      yoc_10: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      college_10: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      state_10: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      qualification_12:  { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      university_12: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      ctype_12: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      percent_12: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      yos_12: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      yoc_12: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      college_12: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      state_12: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      ugqualification:  { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      uguniversity: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      ugctype: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      ugpercent: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      ugyos: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      ugyoc: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      ugcollege: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      ugstate: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      pgqualification:  { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      pguniversity: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      pgctype: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      pgpercent: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      pgyos: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      pgyoc: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      pgcollege: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      pgstate: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      qualification_diploma:  { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      university_diploma: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      ctype_diploma: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      percent_diploma: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      yos_diploma: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      yoc_diploma: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      college_diploma: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      state_diploma: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      languages:  { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      skill1: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      skill2: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      skill3: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      skill4: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      skill5: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      exp_seeker_type: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      company_project_name: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      exp_sdate: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      exp_edate: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      project_role_summary: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
  
      position: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      experience: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      job_category: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      job_location: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      job_industry: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      job_role: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      job_department: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      preferred_designation: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      preferred_ctc: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      present_ctc: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      job_type: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      job_jdate: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      upload_photo:{ 
        type: DataTypes.BLOB,
        allowNull: true,
      },
      referee_name: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
      referee_num: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      referee_paynum: { 
        type: DataTypes.STRING,
        allowNull: true,
      }, 
      referee_email: { 
        type: DataTypes.STRING,
        allowNull: true,
      },
  
      resume_file:{ 
        type: DataTypes.JSON,
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
    }, 
    { timestamps : false });
    return CandidateDetails;
  };