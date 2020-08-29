const puppeteer = require('puppeteer');
const fs = require('fs');

const doDl = async (page, downloadPath) => {
  await page.waitFor(3000);

  await page.click('i.icon-download-alt');

  await page.waitFor(500);

  await page._client.send('Page.setDownloadBehavior', {
    behavior : 'allow',
    downloadPath: downloadPath
  });
  await page.click('#js-csv-dl');
  await page.waitFor(5000);
};


(async () => {
  const EMAIL = process.argv[2];
  const PASS = process.argv[3];
  const DEBUG = Boolean(process.argv[4]);
  const downloadPath = __dirname + '/tmp/';

   //clear files before dl
  const files = fs.readdirSync(downloadPath);
  for (const file of files) {
    if (file.endsWith('.csv')) {
      let filePath = downloadPath + file;
      fs.unlinkSync(filePath);
    }
  }

  const browser = await puppeteer.launch({headless: !DEBUG, slowMo: 10, defaultViewport: null});


  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1');

  await page.goto('https://moneyforward.com/sign_in');

  await page.click('.ssoLink img[alt=email]');
  await page.waitFor(3000);

  await page.type('input[type=email]', EMAIL, {delay: 10});
  await page.click('input[type=submit]');

  await page.waitFor(3000);

  await page.type('input[type=password]', PASS, {delay: 100});
  await page.click('input[type=submit]');

  await page.waitFor(3000);

  await page.goto('https://moneyforward.com/cf');

  await doDl(page, downloadPath);

  await page.click('div.date_range.transaction-in-out-header > button');

  await page.waitFor(5500);

  await doDl(page, downloadPath);

  await browser.close();
})();
