import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import fs from "fs";
import path from "path";
import config from "../config";

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.cloud_api_key,
    api_secret: config.cloudinary.cloud_api_secret,
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: any, fileName: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            file.path,
            { public_id: fileName },
            (error, result) => {
                fs.unlinkSync(file.path);
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

const removeFileFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("File deleted successfully:", result);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw new Error("Failed to delete file from Cloudinary");
    }
};

export const fileUploader = {
    upload,
    uploadToCloudinary,
    removeFileFromCloudinary,
};
