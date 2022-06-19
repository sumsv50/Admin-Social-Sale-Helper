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
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: (req, file) => __awaiter(void 0, void 0, void 0, function* () {
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        const fileNameWithExtensionNameRemoved = file.originalname.replace(/\.[^/.]+$/, "");
        return {
            folder: 'DEV',
            format: 'png',
            public_id: fileNameWithExtensionNameRemoved + "_" + timestamp.toString(),
        };
    }),
});
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, process.cwd()+'/src/public/images/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// })
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
