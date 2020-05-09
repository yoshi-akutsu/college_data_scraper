// local imports
const creds = require('./creds');
const urls = require('./urls');
const data_processors = require('./data_processors');
const scraper = require('./stateScraper');

// other imports
const fetch = require('node-fetch');

// API call to get json of official school names from Google Sheets
async function getSchoolList() {
  const response = await fetch(urls.google_sheets);
  let json = response.json();
  return json;
}

// API call to get json from College Scorecard
async function getCollegeData(school) {
  const url = urls.college_scorecard + school + creds.ipeds_key;
  const response = await fetch(url);
  let json = response.json();
  return json;
}

async function main() {
  await getSchoolList().then(async function (data) {
    for(let i = 0; i < data.values.length; i++) {
      console.log(data.values[i]);
      await getCollegeData(data.values[i]).then(async function (data) {
        try{
          await scraper.scrape(data.results[0].id);
        } catch {
          console.log('No ID found.')
        }
      });
    }
  });
}

main();
