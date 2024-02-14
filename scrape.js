const puppeteer = require('puppeteer');
require('dotenv').config();

async function uploadFile(page, filePath) {
    if (!page) {
        console.error('Не удалось загрузить файл: страница не найдена.');
        return;
    }

    try {
        await page.waitForSelector('#dropBox > button', { visible: true });
        const fileInput = await page.$('body > input');
        await fileInput.uploadFile(filePath);

        console.log('Файл успешно загружен.');
    } catch (error) {
        console.error('Произошла ошибка при загрузке файла:', error);
    }
}

async function selectResolution(page, resolution) {
    try {
        const resolutionActions = {
            '2': async () => {
                await page.waitForSelector('#actionBtns > div > button', { visible: true });
                await page.click('#actionBtns > div > button');
                console.log('Загружено разрешение 2х');
            },
            '3': async () => {
                await page.waitForSelector('#actionBtns > div > button', { visible: true });
                await page.click('#content > div > div > div.col-sm-7 > div:nth-child(8) > form > div:nth-child(1) > div > button');
                await page.click('#bs-select-1-2');
                await page.click('#actionBtns > div > button');
                console.log('Загружено разрешение 3х');
            },
            '4': async () => {
                await page.waitForSelector('#actionBtns > div > button', { visible: true });
                await page.click('#content > div > div > div.col-sm-7 > div:nth-child(8) > form > div:nth-child(1) > div > button');
                await page.click('#bs-select-1-3');
                await page.click('#actionBtns > div > button');
                console.log('Загружено разрешение 4х');
            },
        };

        const action = resolutionActions[resolution];
        if (action) {
            await action();
        } else {
            console.error('Неподдерживаемое разрешение:', resolution);
        }
    } catch (error) {
        console.error('Произошла ошибка при выборе разрешения:', error);
    }
};

async function handleServerOverload(page, filePath, resolution, browser) {
    try {
        await page.waitForSelector('#content > div > div > div.text-danger.text-center.font-weight-bold.font-size-3', { visible: true });
        console.error('Ошибка: Сервер ресурса перегружен.');

        const actions = {
            '1': async () => {
                console.log('Перезагрузка...');
                await page.click('#start_over');
                await uploadFile(page, filePath);
                await selectResolution(page, resolution);
                await handleServerOverload(page);
            },
            '2': async () => {
                console.log('Завершение процесса...');
                await browser.close();
            }
        };

        let action;
        do {
            const answer = await askUser('Выберите действие: 1 - Перезагрузить, 2 - Завершить');
            action = actions[answer];

            if (!action) {
                console.error('Неправильный выбор.');
            }
        } while (!action);

        await action();
    } catch (error) {
        console.error('Произошла ошибка при обработке перегрузки сервера:', error);
    }
};

async function askUser(question) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        readline.question(question + ' ', answer => {
            readline.close();
            resolve(answer);
        });
    });
};
(async () => {
    const url = process.env.URL;
    const filePath = process.env.FILEPATH;
    const resolution = process.env.RESOLUTION;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1000 });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    await uploadFile(page, filePath);
    await selectResolution(page, resolution);
    await handleServerOverload(page, filePath, resolution, browser);
})();
