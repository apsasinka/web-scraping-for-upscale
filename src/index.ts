import * as puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import { uploadFile, selectResolution } from './upload/uploadFunction';
import { handleServerOverload } from './fetchErrors';

dotenv.config();
(async () => {
    const url: string = process.env.URL || '';
    const filePath = process.env.FILEPATH || '';
    const resolution = process.env.RESOLUTION || '';

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1000 });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    await uploadFile(page, filePath!);
    await selectResolution(page, resolution!);
    await handleServerOverload(page, filePath!, resolution!, browser);
})();
