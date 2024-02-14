import * as puppeteer from 'puppeteer';

export async function uploadFile(page: puppeteer.Page | null, filePath: string): Promise<void> {
    if (!page) {
        console.error('Не удалось загрузить файл: страница не найдена.');
        return;
    }

    try {
        await page.waitForSelector('#dropBox > button', { visible: true });
        const fileInput = await page.$('body > input');
        if (!fileInput) {
            console.error('Не удалось найти элемент для загрузки файла.');
        } else {
            await fileInput.uploadFile(filePath);
            console.log('Файл успешно загружен.');
        }
    } catch (error) {
        console.error('Произошла ошибка при загрузке файла:', error);
    }
}

export async function selectResolution(page: puppeteer.Page, resolution: string): Promise<void> {
    try {
        const resolutionActions: Record<string, () => Promise<void>> = {
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

module.exports = {uploadFile, selectResolution};