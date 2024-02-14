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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFilesFromFolder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uploadFunction_1 = require("./uploadFunction");
const fetchErrors_1 = require("../fetchErrors");
function readFilesFromFolder(browser, page, folderPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const files = fs_1.default.readdirSync(folderPath);
            const resolution = process.env.RESOLUTION || '';
            for (const file of files) {
                const filePath = path_1.default.join(folderPath, file);
                console.log('Загружаемый файл:', filePath);
                yield (0, uploadFunction_1.uploadFile)(page, filePath);
                yield (0, uploadFunction_1.selectResolution)(page, resolution);
                yield (0, fetchErrors_1.handleServerOverload)(page, filePath, resolution, browser);
            }
        }
        catch (error) {
            console.error('Ошибка при чтении из каталога:', error);
        }
    });
}
exports.readFilesFromFolder = readFilesFromFolder;
;
module.exports = { readFilesFromFolder };
