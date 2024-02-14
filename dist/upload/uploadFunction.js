"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectResolution = exports.uploadFile = void 0;
function uploadFile(page, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!page) {
            console.error('Не удалось загрузить файл: страница не найдена.');
            return;
        }
        try {
            yield page.waitForSelector('#dropBox > button', { visible: true });
            const fileInput = yield page.$('body > input');
            if (!fileInput) {
                console.error('Не удалось найти элемент для загрузки файла.');
            }
            else {
                yield fileInput.uploadFile(filePath);
                console.log('Файл успешно загружен.');
            }
        }
        catch (error) {
            console.error('Произошла ошибка при загрузке файла:', error);
        }
    });
}
exports.uploadFile = uploadFile;
;
function selectResolution(page, resolution) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resolutionActions = {
                '2': () => __awaiter(this, void 0, void 0, function* () {
                    yield page.waitForSelector('#actionBtns > div > button', { visible: true });
                    yield page.click('#actionBtns > div > button');
                    console.log('Загружено разрешение 2х');
                }),
                '3': () => __awaiter(this, void 0, void 0, function* () {
                    yield page.waitForSelector('#actionBtns > div > button', { visible: true });
                    yield page.click('#content > div > div > div.col-sm-7 > div:nth-child(8) > form > div:nth-child(1) > div > button');
                    yield page.click('#bs-select-1-2');
                    yield page.click('#actionBtns > div > button');
                    console.log('Загружено разрешение 3х');
                }),
                '4': () => __awaiter(this, void 0, void 0, function* () {
                    yield page.waitForSelector('#actionBtns > div > button', { visible: true });
                    yield page.click('#content > div > div > div.col-sm-7 > div:nth-child(8) > form > div:nth-child(1) > div > button');
                    yield page.click('#bs-select-1-3');
                    yield page.click('#actionBtns > div > button');
                    console.log('Загружено разрешение 4х');
                }),
            };
            const action = resolutionActions[resolution];
            if (action) {
                yield action();
            }
            else {
                console.error('Неподдерживаемое разрешение:', resolution);
            }
        }
        catch (error) {
            console.error('Произошла ошибка при выборе разрешения:', error);
        }
    });
}
exports.selectResolution = selectResolution;
;
module.exports = { uploadFile, selectResolution };
