const puppeteer = require('puppeteer');
// const CREDS = require('./creds')

const url = 'https://www.premium.usnews.com/best-colleges/ohio-state-6883';

async function run() {

  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0); 


  const USER_ICON_SELECTOR = '#user-circle_a';
  const LOGIN_SELECTOR = '#app > div > div:nth-child(1) > nav > div.Header__InnerContainer-pfs6rv-5.jTtbyp > div.sm-hide.ml3 > ul > div > a:nth-child(8) > span';
  const USER_FIELD_SELECTOR = '#username'
  const PASSWORD_FIELD_SELECTOR = '#password'
  const BUTTON_SELECTOR = '#login_form > div.Box-s1krs5yn-0.ewBkVU > button > div'

  await page.goto(url);

  await page.click(USER_ICON_SELECTOR);
  console.log('clicked');
  await page.click(LOGIN_SELECTOR);
  console.log('clicked');

  await page.click(USER_FIELD_SELECTOR);
  console.log('clicked');

  
  await page.keyboard.type(CREDS.username);

  await page.click(PASSWORD_FIELD_SELECTOR);
  await page.keyboard.type(CREDS.password);

  await Promise.all([
    page.click(BUTTON_SELECTOR),
    page.waitForNavigation()
  ]);

  await page.goto(url);

  // Overview page
  const IN_STATE_TUITION_SELECTOR = '#app > div > div:nth-child(1) > div.Heading__ProfileHeadingBox-s1djxioy-5.hbWdQA > div > div > div > div.Villain__FlexDiv-s187cgcl-0.kOsTiM > div.Villain__SupplementColumn-s187cgcl-2.cAoyTe > div > div > div > div.border-right.border-left.border-bottom.Panel__Content-u1uggs-0.bPAOQc > table > tbody > tr:nth-child(1) > div > a.Anchor-s1mkgztv-0.iQWpFx';
  const OUT_STATE_TUITION_SELECTOR = '#app > div > div:nth-child(1) > div.Heading__ProfileHeadingBox-s1djxioy-5.hbWdQA > div > div > div > div.Villain__FlexDiv-s187cgcl-0.kOsTiM > div.Villain__SupplementColumn-s187cgcl-2.cAoyTe > div > div > div > div.border-right.border-left.border-bottom.Panel__Content-u1uggs-0.bPAOQc > table > tbody > tr:nth-child(2) > div > a.Anchor-s1mkgztv-0.iQWpFx';
  const ROOM_BOARD_SELECTOR = '#app > div > div:nth-child(1) > div.Heading__ProfileHeadingBox-s1djxioy-5.hbWdQA > div > div > div > div.Villain__FlexDiv-s187cgcl-0.kOsTiM > div.Villain__SupplementColumn-s187cgcl-2.cAoyTe > div > div > div > div.border-right.border-left.border-bottom.Panel__Content-u1uggs-0.bPAOQc > table > tbody > tr:nth-child(3) > div > a.Anchor-s1mkgztv-0.iQWpFx';
  
  let inStateTuition = await page.evaluate((sel) => {
    return document.querySelector(sel).textContent;
  }, IN_STATE_TUITION_SELECTOR);

  let outStateTuition = await page.evaluate((sel) => {
    return document.querySelector(sel).textContent;
  }, OUT_STATE_TUITION_SELECTOR);

  let roomBoard = await page.evaluate((sel) => {
    return document.querySelector(sel).textContent;
  }, ROOM_BOARD_SELECTOR);
  


  console.log(inStateTuition, outStateTuition, roomBoard);

  browser.close()
}

run();