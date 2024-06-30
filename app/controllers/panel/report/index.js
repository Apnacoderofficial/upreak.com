const db = rootRequire('app/models')
const moment = require("moment");

module.exports = {
  
  add_report : async (req, res) => {
  
    if (req.session.role == 'HR') {
      const id = req.query.id;
      let meeting_details = await db.meetings.findAll({
        where: {
          id: id,
        },
        attributes: ['id', 'title', 'email', 'phone_number', 'username', 'alloted_HR', 'start_time', 'end_time', 'role', 'meeting_link', 'status', 'application_id', 'meeting_id', 'process_status'],
        raw: true
      });
      let report_data = await db.reports.findAll({ where: { meeting_id: meeting_details[0].meeting_id } })
      let dashLogin_detail = await db.dash_logins.findOne({ where: { email: meeting_details[0].email } });
  
      let shortname, mou_data = undefined;
      if (dashLogin_detail.createdby.includes('_')) {
        // Split the string after the underscore
        shortname = dashLogin_detail.createdby.split('_')[1];
        mou_data = await db.mou_registrations.findOne({ where: { shortname: shortname } });
      }
      res.render('add_report', {
        meeting_details: !meeting_details ? undefined : meeting_details,
        report_data: !report_data ? undefined : report_data,
        mou_data: !mou_data ? undefined : mou_data
      });
    } else
      res.redirect("/panel/login");
  },
  
  save_report : async (req, res) => {
    try {
      const mid = req.body.data_id;
      const rid = req.body.rpt_id;
      let meeting_details = await db.meetings.findAll({
        where: {
          id: mid,
        },
        attributes: ['id', 'title', 'email', 'phone_number', 'username', 'alloted_HR', 'start_time', 'end_time', 'role', 'meeting_link', 'status', 'application_id', 'meeting_id', 'process_status'],
        raw: true
      });
      const data = {
        meeting_id: meeting_details[0].meeting_id,
        interviewername: req.body.interviewerName,
        candidateid: req.body.candidateId,
        candidatename: req.body.candidateName,
        candidateemail: req.body.candidateEmail,
        candidatephone: req.body.candidatePhone,
        collegename: req.body.candidateCollege,
        interviewpreparedness: req.body.preparednessRating,
        confidencenervousness: req.body.confidenceRating,
        nonverbalcommunication: req.body.nonverbalRating,
        verbalcommunication: req.body.verbalRating,
        teamwork: req.body.teamworkRating,
        computerproficiency: req.body.computerRating,
        enthusiasmmotivation: req.body.enthusiasmRating,
        timemanagement: req.body.timeManagementRating,
        worklifebalance: req.body.workLifeRating,
        achievementsaccomplishments: req.body.achievementsRating,
        fresherexperienced: req.body.fresherExperienced,
        comments: req.body.comments,
        updatedAt: new Date()
      };
      if (!rid) {
        let mdata = {
          process_status: '1',
          updatedAt: new Date()
        }
        await db.reports.create(data)
        await meetings.update(mdata, { where: { id: mid }, raw: true, });
      } else
        await db.reports.update(data, { where: { id: rid }, raw: true, });
      res.redirect(`/panel/add_report?id=${mid}`);
    } catch (error) {
      console.log(error);
      res.redirect("/error-500");
    };
  
  },
  
  generate_report : async (req, res) => {
  
    if (req.session.role == 'HR') {
      const id = req.params.id;
      let meeting_details = await db.meetings.findAll({
        where: {
          id: id,
        },
        attributes: ['id', 'title', 'email', 'phone_number', 'username', 'alloted_HR', 'start_time', 'end_time', 'role', 'meeting_link', 'status', 'application_id', 'meeting_id', 'process_status'],
        raw: true
      });
      let report_data = await db.reports.findOne({ where: { meeting_id: meeting_details[0].meeting_id } })
      res.render('add_report', {
        meeting_details: !meeting_details ? undefined : meeting_details,
        report_data: !report_data ? undefined : report_data
      });
    } else
      res.redirect("/panel/login");
  },
  
  view_report : async (req, res) => {
  
    if (req.session.role == 'User') {
      const id = req.params.id;
  
      let report_data = await db.reports.findAll({ where: { id: id } })
      let dashLogin_detail = await db.dash_logins.findOne({ where: { email: report_data[0].candidateemail } });
      let reponse_detail = await db.responses.findOne({ where: { emailid: report_data[0].candidateemail } });
      let meeting_detail = await db.meetings.findOne({ where: { meeting_id: report_data[0].meeting_id } });
      let shortname, mou_data = undefined;
      if (dashLogin_detail.createdby.includes('_')) {
        // Split the string after the underscore
        shortname = dashLogin_detail.createdby.split('_')[1];
        mou_data = await db.mou_registrations.findOne({ where: { shortname: shortname } });
      }
  
      // Convert the string to a Date object
      const dateObject = new Date(meeting_detail.start_time);
  
      // Get the date in YYYY-MM-DD format
      const interviewDate = dateObject.toISOString().split('T')[0];
  
  
      res.render('report', {
        locals: report_data,
        mou_data: !mou_data ? undefined : mou_data, session: req.session, dashLogin_detail, reponse_detail, meeting_detail, interviewDate
      });
    } else
      res.redirect("/panel/login");
  },
  
  report_details : async (req, res) => {
  
    if (req.session.role == 'User') {
      try {
        let data = await db.reports.findAll({
          where: {
            candidateemail: req.session.userid
          }
        });
  
        const currentDate = moment(); // Get the current date and time
        // Filter the data based on the criteria
        data = data.filter(report => {
          const createdAtDate = moment(report.createdAt, 'YYYY-MM-DD HH:mm:ss.SSSZ');
          const hoursDifference = currentDate.diff(createdAtDate, 'hours');
  
          return hoursDifference >= 24;
        });
  
        res.render("report_details", { locals: data });
      } catch (err) {
        console.error(err);
        res.redirect("/error-500");
      }
    } else
      res.render("login");
  }
  
}