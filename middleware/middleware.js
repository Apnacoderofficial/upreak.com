// middleware.js

const db = require("../config/dbconfig");
const Corporatecorner = db.corporatecorner;

const loadCorporateCorners = async (req, res, next) => {
  try {
    const corporateCorners = await Corporatecorner.findAll();
    res.locals.corporateCorners = corporateCorners;
    next();
  } catch (err) {
    console.error('Error fetching Corporatecorners:', err);
    res.locals.corporateCorners = [];
    next();
  }
};

module.exports = { loadCorporateCorners };