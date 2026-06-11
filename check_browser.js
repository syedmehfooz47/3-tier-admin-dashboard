const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`[BROWSER PAGE ERROR] ${error.message}`);
  });

  page.on('requestfailed', request => {
    console.log(`[BROWSER NETWORK ERROR] ${request.url()} - ${request.failure().errorText}`);
  });

  await page.goto('http://localhost/', { waitUntil: 'networkidle2' });
  
  console.log("Page loaded. HTML:");
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log(html.substring(0, 500) + '...');
  
  await browser.close();
})();
