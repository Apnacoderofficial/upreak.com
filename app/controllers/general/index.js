const db = rootRequire('app/models'),
      fs = require('fs'),
      path = require('path'),
      QRCode = require('qrcode'),
      json2csv = require('json2csv'),
      parseCSV = require("../../utils/parseCSV");
      
exports.download_resume = async (req, res) => {
  const id = req.query.id;
  let data = await db.responses.findByPk(id)
  if (data.resume_file) {
    const filePath = 'uploads/' + data.resume_file;
    const fileName = data.resume_file;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Stream the file content to the response
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
  else {
    res.redirect('/panel/view_job_seekers');
  }
};

exports.view_activity = async (req, res) => {

  // && req.session.role== 'admin'where: {role:'admin'  }
  await db.activity_logs.findAll({})
    .then(data => {
      // && req.session.role== 'admin'
      if (req.session.role == 'Master') {
        res.render("view_activity", {
          locals: data,
        });
      }
      else
        res.redirect("/panel/login");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
};

exports.generate_qr = async (req, res) => {
  const shortname = req.query.shortname;

  // Data you want to encode in the QR code
  const data = `${shortname}`;
  const options = {
    errorCorrectionLevel: 'H', // High error correction level
    type: 'image/png', // Output type (you can use 'svg', 'png', 'pdf', etc.)
    rendererOpts: {
      quality: 0.3, // Image quality (only for 'image/png' and 'image/jpeg')
    },
  };

  const outputFolder = path.join(__dirname, '../public/qr_images');
  const outputPath = path.join(outputFolder, `Qr_Image.png`);

  // Ensure the output folder exists, create it if not
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  QRCode.toFile(outputPath, data, options, (err) => {
    if (err) {
      console.error(`Error generating QR Code: ${err.message}`);
      return res.status(500).send({
        status: 500,
        msg: 'Error generating QR Code',
      });
    }

    console.log('QR Code generated successfully! Saved to:', outputPath);

    // Read the generated file as a buffer
    const buffer = fs.readFileSync(outputPath);

    // Send the buffer to the frontend along with a success message
    return res.send({
      status: 200,
      msg: 'QR Code generated successfully!',
      data: buffer.toString('base64'), // Convert buffer to base64 for sending to frontend
    });
  });
};

exports.import_csv = async function (req, res, next) {
  try {

    let tableName = req.params.tableName
    let tableModel = db[tableName];
    // Use queryInterface to get the column names
    const tableInfo = await tableModel.describe();

    // Extract column names from the returned data
    let columnNames = Object.keys(tableInfo);

    // Define an array of columns to be excluded
    const excludedColumns = ['alldata', 'createdAt', 'updatedAt', 'id', 'application_id', 'email_verify', 'phone_verify', 'whatsapp_verify', 'plan_detail', 'upload_photo', 'resume_file'];

    // // Remove excluded columns from columnNames array
    columnNames = columnNames.filter(columnName => !excludedColumns.includes(columnName));

    parseCSV.parse(req.file.path, true, function (err, data) {
      db[tableName].bulkCreate(data, {
        updateOnDuplicate: columnNames
      });
      res.send('OK');
    })
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).send(error);
  }
};

exports.export_table = async (req, res) => {
  try {
    let tableName = req.params.tableName
    let tableModel = db[tableName];
    // Use queryInterface to get the column names
    const tableInfo = await tableModel.describe();

    // Extract column names from the returned data
    let columnNames = Object.keys(tableInfo);


    // Remove 'alldata' from columnNames array
    // columnNames = columnNames.filter(columnName => columnName !== 'id');
    const excludedColumns = ['alldata', 'updatedAt', 'id', 'application_id', 'email_verify', 'phone_verify', 'whatsapp_verify', 'plan_detail', 'upload_photo', 'resume_file', 'resume'];

    // // Remove excluded columns from columnNames array
    columnNames = columnNames.filter(columnName => !excludedColumns.includes(columnName));

    let data = await tableModel.findAll({raw: true});
    data = await data.
    map(item => {
      var tempObj = {};
      // Dynamically set keys for the tempObj using column names
      columnNames.forEach(columnName => {
        tempObj[columnName] = item[columnName];
      });
      return tempObj;
    });
    fields = Object.keys(data[0]);
    var csv = json2csv({ "data": data, "fields": fields });
    const filename = 'export_' + tableName + '.csv';

    // Set headers for file download
    res.attachment(filename);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).send(error);
  }
};

exports.get404 = async (req, res) => {
  res.render('error-404');
};

exports.get500 = async (req, res) => {
  res.render('error-500');
};

exports.get_board_data = (req, res) => {
  const { query } = req.query;
  const matches = getMatchedData(data_board, query);
  res.json(matches);
};

exports.get_college_data = (req, res) => {
  const { query } = req.query;
  const matches = getMatchedData(data_college, query);
  res.json(matches);
};

exports.get_university_data = (req, res) => {
  const { query } = req.query;
  const matches = getMatchedData(data_university, query);
  res.json(matches);
};

exports.get_skills_data = (req, res) => {
  const { query } = req.query;
  const matches = getMatchedData(data_skills, query);
  res.json(matches);
};

exports.get_jobs_data = (req, res) => {
  const { query } = req.query;
  const matches = getMatchedData(data_jobs, query);
  res.json(matches);
};