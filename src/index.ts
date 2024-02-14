import * as puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { readFilesFromFolder } from './upload/readFiles';

dotenv.config();
(async () => {
    const url: string = process.env.URL || '';
    const folderPath = process.env.FOLDER || '';

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1000 });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    await readFilesFromFolder(browser, page, folderPath);
})();
