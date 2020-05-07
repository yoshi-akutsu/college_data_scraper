const puppeteer = require('puppeteer');
const selectors = require('./state_selectors');

const unitId = 204796;

async function scrape(unitId) {

  const REPORTED_DATA = '#tblLinks > tbody > tr > td:nth-child(1) > a:nth-child(3)';
  const ENROLLMENT_DATA = '#divSurveysContainer > div:nth-child(3) > a';
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

    // Data points
  // let appFee = await page.evaluate((sel) => {
  //   return document.querySelector(sel).textContent;
  // }, selectors.APP_FEE)
  let data = [];
  for (const property in selectors) {
    data.push({ [property]:
      await page.evaluate( (sel) => {
        return document.querySelector(sel).textContent;
      }, selectors[property]) }
     )
  }
  console.log(data)

  browser.close()
}

scrape(unitId);

//exports.scrape = scrape;
