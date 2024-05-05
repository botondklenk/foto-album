import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
    name: string;
    email: string;
    passhash: string;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    passhash: { type: String, required: true }
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passhash);
};

export const User = model<IUser>('User', userSchema);