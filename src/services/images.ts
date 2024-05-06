import { Request, Response, NextFunction } from "express";
import multer, { Multer } from 'multer';
import { MulterAzureStorage } from 'multer-azure-blob-storage';
import { v4 as uuidv4 } from 'uuid';
import { Image } from "../models/image";

let upload: null | Multer;

const getUpload = () => {
    upload = multer({
        storage: new MulterAzureStorage({
            accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
            connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
            accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
            containerName: process.env.AZURE_STORAGE_CONTAINER_NAME || 'a container name',
            blobName:  async (req, file) => {
                const blobName = uuidv4();
                req.body.blobName = blobName;
                return blobName;
            }
        })
    });
}

export const uploadImage = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!upload) {
            getUpload();
        }
        upload!.single('image')(req, res, (err) => {
            if (err) {
                console.error('Error in uploadImage middleware:', err);
            }
            next();
        });
    };
}

export const saveImageData = async (req: Request, res: Response) => {
    const name = req.file?.originalname;
    const blobName = req.body.blobName;
    const image = new Image({ name, blobName });
    await image.save();
    res.redirect('/');
}

export const getImages = async (req: Request, res: Response, next: NextFunction) => {
    const images = await Image.find();
    res.locals.images = images;
    next();
}

export const getImage = async (req: Request, res: Response, next: NextFunction) => {
    const image = await Image.findById(req.query.imageId);
    res.locals.image = image;
    next();
}