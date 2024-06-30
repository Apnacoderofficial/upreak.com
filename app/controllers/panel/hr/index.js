const db = rootRequire('app/models');
const { uploadFileToDrive, generatePublicUrl } = require('../../../baseController/driveUpload');

exports.performance_hr = async (req, res) => {

  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin') {
    let mdata = await db.meetings.findAll({})
    await db.dash_logins.findAll({ where: { role: 'HR' } })
      .then(hrData => {
        res.render("performance_hr", { hrData, mdata, filterHrdata: undefined });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.render("login");
};

exports.filter_performance_hr = async (req, res) => {

  const email = req.body.filterSelect;
  if (req.session.role == 'Master' || req.session.role == 'SubAdmin' || req.session.role == 'Admin') {
    let filterHrdata = await new Promise((resolve, reject) => {
      const query = `SELECT
      COUNT(*) AS total_meetings,
      SUM(CASE WHEN status = 'Booked' AND TO_CHAR("createdAt", 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM') THEN 1 ELSE 0 END) AS month_meetings
  FROM
      meetings
  WHERE
      "alloted_HR" = '${email}'
      AND status = 'Booked';`;

      db.mainModel.execQuery(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    console.log(filterHrdata);
    await db.dash_logins.findAll({ where: { role: 'HR' } })
      .then(hrData => {
        res.render("performance_hr", { hrData, mdata: undefined, filterHrdata, email });
      })
      .catch(err => {
        res.redirect("/error-500");
      });

  } else
    res.render("login");
};