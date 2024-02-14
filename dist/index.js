"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = __importStar(require("puppeteer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
;
function handleServerOverload(page, filePath, resolution, browser) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield page.waitForSelector('#content > div > div > div.text-danger.text-center.font-weight-bold.font-size-3', { visible: true });
            console.error('Ошибка: Сервер ресурса перегружен.');
            const actions = {
                '1': () => __awaiter(this, void 0, void 0, function* () {
                    console.log('Перезагрузка...');
                    yield page.click('#start_over');
                    yield uploadFile(page, filePath);
                    yield selectResolution(page, resolution);
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
(() => __awaiter(void 0, void 0, void 0, function* () {
    const url = process.env.URL || '';
    const filePath = process.env.FILEPATH || '';
    const resolution = process.env.RESOLUTION || '';
    const browser = yield puppeteer.launch({ headless: false });
    const page = yield browser.newPage();
    yield page.setViewport({ width: 1200, height: 1000 });
    yield page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    yield uploadFile(page, filePath);
    yield selectResolution(page, resolution);
    yield handleServerOverload(page, filePath, resolution, browser);
}))();
