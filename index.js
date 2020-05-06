// local imports
const creds = require('./creds');
const urls = require('./urls');
const data_processors = require('./data_processors');
const scraper = require('./scraper');

// other imports
const fetch = require('node-fetch');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})


// API call to get json of official school names from Google Sheets
async function getSchoolList() {
  const response = await fetch(urls.google_sheets);
  let json = response.json();
  return json;
}

// API call to get json from College Scorecard
async function getCollegeData(school) {
  const url = urls.college_scorecard + school +creds.ipeds_key;
  console.log(url);
  const response = await fetch(url);
  let json = response.json();
  return json;
}

// Uses readline to get input from the CLI
const getSearchInput = () => {
  return new Promise((resolve, reject) => {
    readline.question(`Enter search term: `, (searchTerm) => {
      readline.pause();
      search = searchTerm;
      resolve();
    })
  })
}

const getSchoolInput = () => {
  return new Promise((resolve, reject) => {
    readline.question(`Enter school number: `, (schoolNumber) => {
      readline.pause();
      searchNumber = schoolNumber;
      resolve();
    })
  })
}


let search = '';
let matches = [];
let searchNumber = null;

async function main() {
  await getSearchInput();
  console.log('Searching... ', search);
  await getSchoolList().then(data => {
    for(let i = 0; i < data.values.length; i++) {
          let lowered = data.values[i][0].toLowerCase();
          let substring = search.toLowerCase();
          if(lowered.includes(substring)) {
              matches.push(data.values[i][0])
    }
  }
  });
  if (matches.length === 0) {
    console.log('No results found');
    return;
  }
  for (let i = 0; i < matches.length; i++) { 
    console.log(i + ': ' + matches[i]);
  }

  await getSchoolInput();
  readline.close();

  let scorecardData = getCollegeData(data_processors.stringToQuery(matches[searchNumber])).then(data => {
    return data;
  });

  scorecardData.then(data => {
    console.log(data.results[0].id);
  });

}

main();
