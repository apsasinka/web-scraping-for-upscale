import * as puppeteer from 'puppeteer';
import { uploadFile, selectResolution } from './upload/uploadFunction';

export async function handleServerOverload(page: puppeteer.Page, filePath: string, resolution: string, browser: puppeteer.Browser): Promise<void> {
    try {
        await page.waitForSelector('#content > div > div > div.text-danger.text-center.font-weight-bold.font-size-3', { visible: true });
        console.error('Ошибка: Сервер ресурса перегружен.');

        const actions: Record<string, () => Promise<void>> = {
            '1': async () => {
                console.log('Перезагрузка...');
                await page.click('#start_over');
                await uploadFile(page, filePath);
                await selectResolution(page, resolution);
                await handleServerOverload(page, filePath, resolution, browser);
            },
            '2': async () => {
                console.log('Завершение процесса...');
                await browser.close();
            }
        };

        let action;
        do {
            const answer: string = await askUser('Выберите действие: 1 - Перезагрузить, 2 - Завершить');
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

async function askUser(question: string): Promise<string> {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise<string>(resolve => {
        readline.question(question + ' ', (answer: string) => {
            readline.close();
            resolve(answer);
        });
    });
};

module.exports = { handleServerOverload };