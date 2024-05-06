import { Request, Response, NextFunction } from "express";
import multer, { Multer } from 'multer';
import { MulterAzureStorage } from 'multer-azure-blob-storage';
import { v4 as uuidv4 } from 'uuid';
import { Image } from "../models/image";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";
import { SortOrder } from "mongoose";

let upload: null | Multer;
const getUpload = () => {
    if (!upload) {
        upload = multer({
            storage: new MulterAzureStorage({
                accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME,
                connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
                accessKey: process.env.AZURE_STORAGE_ACCESS_KEY,
                containerName: 'fotos',
                blobName: async (req, file) => {
                    const blobName = uuidv4();
                    req.body.blobName = blobName;
                    return blobName;
                }
            })
        });
    }
    return upload;
}

let containerClient: null | ContainerClient;
const getBlob = (name: string) => {
    if (!containerClient) {
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING!);
        containerClient = blobServiceClient.getContainerClient('fotos');
    }
    return containerClient.getBlobClient(name);
}

export const uploadImage = () => {
    return (req: Request, res: Response, next: NextFunction) => {

        getUpload().single('image')(req, res, (err) => {
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
    let sort: { [key: string]: SortOrder } = {};
    const sortDirection = req.query.sortDirection === '1' ? 1 : -1;
    const sortField = req.query.sortField as string | null;
    if (sortField) {
        sort[sortField] = sortDirection;
    }
    res.locals.sortDirection = sortDirection;
    res.locals.sortField = sortField;

    const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : 1;
    const pageSize = 5;
    const skip = (page - 1) * pageSize;

    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / pageSize);

    const images = await Image.find().sort(sort).skip(skip).limit(pageSize);

    res.locals.images = images;
    res.locals.page = page;
    res.locals.totalPages = totalPages;
    next();
}

export const getImage = async (req: Request, res: Response, next: NextFunction) => {
    const image = await Image.findById(req.query.imageId);
    res.locals.image = image;
    next();
}

export const deleteImage = async (req: Request, res: Response) => {
    const imageId = req.body.imageId;
    console.log('Deleting image with id:', imageId);
    const image = await Image.findById(imageId);
    if (!image) {
        res.status(404).send('Image not found');
        return;
    }
    await getBlob(image.blobName).delete();
    await Image.findByIdAndDelete(imageId);
    res.redirect('/');
}