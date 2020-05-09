const puppeteer = require('puppeteer');
const selectors = require('./state_selectors');
const urls = require('./urls');

const mongoose = require('mongoose');
const fetch = require('node-fetch');

const School = require('./schoolSchema');

mongoose.connect(urls.mongo_db, { useNewUrlParser: true });
var db = mongoose.connection;
console.log('DB connected');
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let Schema = mongoose.Schema;

// API call to get json of official school names from Google Sheets
async function getSchoolList() {
  try {
    const response = await fetch(urls.google_sheets);
    let json = response.json();
    return json;
  } catch {
    console.log('Fetch failed.')
  }
}

async function scrape(unitId) {

  const REPORTED_DATA = '#tblLinks > tbody > tr > td:nth-child(1) > a:nth-child(3)';
  const ENROLLMENT_DATA = '#divSurveysContainer > div:nth-child(3) > a';
  const SCHOOL_NAME = '#spanInstitutionName';
  const url = 'https://nces.ed.gov/ipeds/datacenter/institutionprofile.aspx?unitId=' + unitId;

  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();
 
  await page.goto(url);
  try {
    await page.click(REPORTED_DATA);

  // Institutional Characteristics
  await page.waitForSelector(ENROLLMENT_DATA);
  await page.click(ENROLLMENT_DATA);
  } catch {
    console.log('No reported data.')
  }

  try {
    await page.waitForSelector(selectors.ALASKA, { timeout: 1500 });

    let data = {};

    for (const property in selectors) {
      data[[property]] = await page.evaluate( (sel) => {
        if (document.querySelector(sel) !== null) {
          return document.querySelector(sel).textContent;
        }
          return null;
        }, selectors[property]) 
    }
    let total = 0;
    for (const property in data) {
      
      if (data[[property]] !== null) {
        data[[property]] = data[[property]].trim();
        data[[property]] = data[[property]].replace(/,/g, '');
        if (data[[property]] === '') {
          data[[property]] = 0;
        }
        else {
          data[[property]] = parseInt(data[[property]]);
          total += data[[property]];
        }
      }
      data['TOTAL'] = total;
    }

    data['SCHOOL_NAME'] = await page.evaluate( (sel) => {
      return document.querySelector(sel).textContent;
    }, SCHOOL_NAME)

    console.log(data);
    let schoolInstance = new School(data);
    console.log(schoolInstance)
      schoolInstance.save(function (err) {
        if (err) {
          console.log(err)
        }
        console.log('Saved successfully.')
      })
  } catch (error) {
    console.log('Could not get data.');
  }
  
  

  await browser.close();
}


exports.scrape = scrape;
