const puppeteer = require('puppeteer');
const selectors = require('./scraper_selectors');

const unitId = 204796;

async function scrape(unitId) {


  const url = 'https://nces.ed.gov/ipeds/datacenter/institutionprofile.aspx?unitId=' + unitId;

  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
 
  await page.goto(url);

  await page.click(selectors.REPORTED_DATA);

  // Institutional Characteristics
  await page.waitForSelector(selectors.INST_CHAR);
  await page.click(selectors.INST_CHAR);

  await page.waitForSelector(selectors.APP_FEE);

    // Data points
  let appFee = await page.evaluate((sel) => {
    return document.querySelector(sel).textContent;
  }, selectors.APP_FEE)

  let inStateTuition = await page.evaluate((sel) => {
    return document.querySelector(sel).textContent;
  }, selectors.IN_STATE_TUITION)

  let outStateTuition = await page.evaluate((sel) => {
    return document.querySelector(sel).textContent;
  }, selectors.OUT_STATE_TUITION)
  
  console.log(appFee, inStateTuition, outStateTuition);
  await page.click(selectors.X_BUTTON);

  // Admissions & Test Scores
  await page.waitForSelector(selectors.ADMISSION_TEST_SCORES);
  await page.click(selectors.ADMISSION_TEST_SCORES);

  await page.waitForSelector(selectors.NUM_APPLICANTS);

    // Data points
  let numApplicants = await page.evaluate((sel) => {
    return document.querySelector(sel).textContent;
  }, selectors.NUM_APPLICANTS)

  
  console.log('Applicants: ' + numApplicants);

  await page.click(selectors.X_BUTTON);

  // Student Financial Aid
  await page.waitForSelector(selectors.STUDENT_FINAID);
  await page.click(selectors.STUDENT_FINAID);

  await page.waitForSelector(selectors.INST_GRANTS);

  // Data points
  let institutionalGrants = await page.evaluate((sel) => {
    return document.querySelector(sel).textContent;
  }, selectors.INST_GRANTS)

  console.log('Institutional Grants: ' + institutionalGrants);

  await page.click(selectors.X_BUTTON);

  await page.waitForNavigation();

  browser.close()
}

scrape(unitId);

//exports.scrape = scrape;
