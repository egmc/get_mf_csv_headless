const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const EMAIL = process.argv[2];
  const PASS = process.argv[3];

  const browser = await puppeteer.launch({headless: false});


  const page = await browser.newPage();
  await page.goto('https://moneyforward.com/users/sign_in');

  await page.click('a.ssoLink img[alt=email]');
  await page.waitFor(3000);

  // // Get the "viewport" of the page, as reported by the page.
  // const dimensions = await page.evaluate(() => {
  //   return {
  //     width: document.documentElement.clientWidth,
  //     height: document.documentElement.clientHeight,
  //     deviceScaleFactor: window.devicePixelRatio
  //   };
  // });

  let downloadPath = './tmp/';

  // await page.focus('input[type=email]');
  await page.type('input[type=email]', EMAIL, {delay: 100});
  await page.click('input[type=submit]');

  await page.waitFor(3000);

  await page.type('input[type=password]', PASS, {delay: 100});
  await page.click('input[type=submit]');

  await page.waitFor(3000);

  await page.goto('https://moneyforward.com/cf');

  await page.waitFor(3000);

  await page.click('i.icon-download-alt');

  await page.waitFor(500);

  await page._client.send('Page.setDownloadBehavior', {
    behavior : 'allow',
    downloadPath: downloadPath
  });


  await page.click('#js-csv-dl');

  await page.waitFor(5000);

  const files = fs.readdirSync(downloadPath);
  for (const file of files) {
    console.log(file);
  }

  await browser.close();
})();