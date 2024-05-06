import { Schema, model, Document } from 'mongoose';

interface IImage extends Document {
    name: string;
    blobName: string;
    uploadDate: Date;
}

const imageSchema = new Schema<IImage>({
    name: { type: String },
    blobName: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
});

export const Image = model<IImage>('Image', imageSchema);