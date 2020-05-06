const puppeteer = require('puppeteer');

const unitId = 204796;

// This is where we'll put the code to get around the tests.
// const preparePageForTests = async (page) => {
//   // Pass the User-Agent Test.
//   const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
//     'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
//   await page.setUserAgent(userAgent);
// }

async function scrape(unitId) {
  const APP_FEE_SELECTOR = '#tb_f10854';
  const REPORTED_DATA_SELECTOR = '#tblLinks > tbody > tr > td:nth-child(1) > a:nth-child(3)';
  const INST_CHAR_SELECTOR = '#divSurveysContainer > div:nth-child(1) > a';

  const url = 'https://nces.ed.gov/ipeds/datacenter/institutionprofile.aspx?unitId=' + unitId;

  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
 
  await page.goto(url);

  await page.click(REPORTED_DATA_SELECTOR);

  await page.waitForSelector(INST_CHAR_SELECTOR);
  await page.click(INST_CHAR_SELECTOR);

  await page.waitForSelector(APP_FEE_SELECTOR);

  let appFee = await page.evaluate((sel) => {
    return document.querySelector(sel).textContent;
  }, APP_FEE_SELECTOR)
  
  console.log(appFee);

  await page.waitForNavigation();

  browser.close()
}

scrape(unitId);

//exports.scrape = scrape;
