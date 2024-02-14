const puppeteer = require('puppeteer');
require('dotenv').config();

async function uploadFile(page, filePath) {
    if (!page) {
        console.error('Не удалось загрузить файл: страница не найдена.');
        return;
    }

    try {
        const fileInput = await page.$('body > input');
        await fileInput.uploadFile(filePath);

        console.log('Файл успешно загружен.');
    } catch (error) {
        console.error('Произошла ошибка при загрузке файла:', error);
    }
}


(async () => {
    const url = process.env.URL;
    const filePath = process.env.FILEPATH;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url, { timeout: 60000 });
    await page.setViewport({ width: 1500, height: 1000 });

    await uploadFile(page, filePath);
})();
