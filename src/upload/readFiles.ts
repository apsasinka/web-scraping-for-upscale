import * as puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { uploadFile, selectResolution } from './uploadFunction';
import { handleServerOverload } from '../fetchErrors';

export async function readFilesFromFolder(browser: puppeteer.Browser, page: puppeteer.Page, folderPath: string): Promise<void> {
    try {
        const files = fs.readdirSync(folderPath);
        const resolution = process.env.RESOLUTION || ''; //мб переместить потом в цикл, для выбора разрешения для каждого фото?

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            console.log('Загружаемый файл:', filePath);

            await uploadFile(page, filePath);
            await selectResolution(page, resolution!);
            await handleServerOverload(page, filePath!, resolution!, browser);
        }
    } catch (error) {
        console.error('Ошибка при чтении из каталога:', error);
    }
};

module.exports = { readFilesFromFolder };