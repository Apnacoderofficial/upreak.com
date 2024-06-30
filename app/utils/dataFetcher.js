const fs = require('fs');
const csv = require('csv-parser');

const data_board = [];
const data_college = [];
const data_university = [];
const data_skills = [];
const data_jobs = [];

// Function to load data from CSV
const loadData = (filePath, dataArray, key) => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        dataArray.push(row[key]);
      })
      .on('end', () => {
        console.log(`${key} csv file successfully processed.`);
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Load all data
const loadAllData = async () => {
  await Promise.all([
    loadData('db/board.csv', data_board, 'board'),
    loadData('db/college.csv', data_college, 'college'),
    loadData('db/university.csv', data_university, 'university'),
    loadData('db/skills.csv', data_skills, 'Skills'),
    loadData('db/jobs.csv', data_jobs, 'jobs')
  ]);
};

module.exports = {
  loadAllData,
  data_board,
  data_college,
  data_university,
  data_skills,
  data_jobs
};
