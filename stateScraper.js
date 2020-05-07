const puppeteer = require('puppeteer');
const selectors = require('./state_selectors');


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

  await page.click(REPORTED_DATA);

  // Institutional Characteristics
  await page.waitForSelector(ENROLLMENT_DATA);
  await page.click(ENROLLMENT_DATA);

  await page.waitForSelector(selectors.UNKNOWN);

  let data = {};

  for (const property in selectors) {
    data[[property]] = await page.evaluate( (sel) => {
      if (document.querySelector(sel) !== null) {
        return document.querySelector(sel).textContent;
      }
        return null;
      }, selectors[property]) 
  }

  for (const property in data) {
    if (data[[property]] !== null) {
      data[[property]] = data[[property]].trim();
      data[[property]] = data[[property]].replace(/,/g, '');
      if (data[[property]] === '') {
        data[[property]] = 0;
      }
      else {
        data[[property]] = parseInt(data[[property]]);
      }
    }
  }

  data['SCHOOL_NAME'] = await page.evaluate( (sel) => {
    return document.querySelector(sel).textContent;
  }, SCHOOL_NAME)
  console.log(data);
  

  await browser.close();
}


exports.scrape = scrape;
