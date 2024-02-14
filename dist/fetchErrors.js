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
exports.handleServerOverload = void 0;
const uploadFunction_1 = require("./upload/uploadFunction");
function handleServerOverload(page, filePath, resolution, browser) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield page.waitForSelector('#content > div > div > div.text-danger.text-center.font-weight-bold.font-size-3', { visible: true });
            console.error('Ошибка: Сервер ресурса перегружен.');
            const actions = {
                '1': () => __awaiter(this, void 0, void 0, function* () {
                    console.log('Перезагрузка...');
                    yield page.click('#start_over');
                    yield (0, uploadFunction_1.uploadFile)(page, filePath);
                    yield (0, uploadFunction_1.selectResolution)(page, resolution);
                    yield handleServerOverload(page, filePath, resolution, browser);
                }),
                '2': () => __awaiter(this, void 0, void 0, function* () {
                    console.log('Завершение процесса...');
                    yield browser.close();
                })
            };
            let action;
            do {
                const answer = yield askUser('Выберите действие: 1 - Перезагрузить, 2 - Завершить');
                action = actions[answer];
                if (!action) {
                    console.error('Неправильный выбор.');
                }
            } while (!action);
            yield action();
        }
        catch (error) {
            console.error('Произошла ошибка при обработке перегрузки сервера:', error);
        }
    });
}
exports.handleServerOverload = handleServerOverload;
;
function askUser(question) {
    return __awaiter(this, void 0, void 0, function* () {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return new Promise(resolve => {
            readline.question(question + ' ', (answer) => {
                readline.close();
                resolve(answer);
            });
        });
    });
}
;
module.exports = { handleServerOverload };
