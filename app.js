global.rootRequire = name => require(`${__dirname}/${name}`);

var express = require('express'),
    config = rootRequire('config/config'),
    db = rootRequire('app/models'),
    moment = require('moment')
    redisClient = rootRequire('config/redisClient');

    const { loadAllData, data_board, data_college, data_university, data_skills, data_jobs } = require('./app/utils/dataFetcher');

var app = express();

rootRequire('config/express')(app, config);

// Function to handle starting the server
const startServer = () => {
    app.listen(config.port, () => {
        console.log(`Upreak Server is listening on port ${config.port}`);
    });
};

// Handle Redis connection events
const redisConnection = new Promise((resolve, reject) => {
    redisClient.once('connect', resolve);
    redisClient.on('error', (err) => {
        console.error('Error connecting to Redis:', err);
        reject(err);
    });
});

// Handle Sequelize authentication
const sequelizeConnection = db.sequelize.authenticate();

// Combine both connection promises
Promise.all([sequelizeConnection, loadAllData()])
    .then(() => {
        console.log('Connected to Redis and authenticated with Sequelize');
        global.data_board = data_board;
        global.data_college = data_college;
        global.data_university = data_university;
        global.data_skills = data_skills;
        global.data_jobs = data_jobs;
        startServer();
    })
    .catch((err) => {
        console.error('Failed to connect to Redis or authenticate with Sequelize:', err);
        process.exit(1); // Exit with non-zero code to indicate failure
    });

// Synchronize the models with the database (if necessary)
// db.sequelize.sync({ force: false }).then(() => {
//     console.log("Database Resync is done");
// }).catch(err => {
//     console.error('Error during database synchronization:', err);
//     process.exit(1); // Exit with non-zero code to indicate failure
// });

app.locals.moment = moment;

app.locals.addScripts = function (all, url) {
    app.locals.scripts = [];
    if (all != undefined) {
        return all.map(function (script) {
            return "<script nonce='app' src='" + url + "/" + script + "?v1'></script>";
        }).join('\n ');
    }
    else {
        return '';
    }
};

app.locals.addCss = function (all, url) {
    app.locals.css = [];
    if (all != undefined) {
        return all.map(function (css) {

            return "<link href='" + url + "/" + css + "' rel='stylesheet' type='text/css' />";
        }).join('\n ');
    }
    else {
        return '';
    }
};

app.locals.getScripts = function (req, res) {
    return scripts;
};

/** Function to be utilized by views to decide whether to show particular content or not */
app.locals.hasPermission = function (allowedPermission, userPermissions) {
    return userPermissions.includes(allowedPermission);
}

// Utility function to get matched data for job_seekers and candidate_details
app.locals.getMatchedData = (dataArray, query, limit = 10) => {
    return dataArray.filter(item => item.toLowerCase().includes(query.toLowerCase())).slice(0, limit);
};

app.locals.createActivityLog = async (username, email, adminId, activity) => {
    try {
      const newActivityLog = await db.activity_logs.create({
        name: username,
        email,
        admin_id: adminId,
        activity
      });
      return newActivityLog;
    } catch (error) {
      throw new Error(`Failed to create activity log: ${error.message}`);
    }
  };

global.hasPermission = app.locals.hasPermission;
global.getMatchedData = app.locals.getMatchedData;
global.createActivityLog = app.locals.createActivityLog;