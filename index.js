const puppeteer = require('puppeteer');
require('dotenv').config()

async function connectToBrows() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1000, height: 500  });

    await page.goto('https://www.i2img.com/upscale-image', { timeout: 60000 });
    await page.screenshot( { path: 'example.png' } );

    await browser.close();
}

connectToBrows();