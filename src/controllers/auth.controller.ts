import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    try {
        const passhash = await bcrypt.hash(password, 10);
        let user = await User.findOne({ email });
        if (user) {
            throw new Error('Email is already in use');
        }
        user = new User({ name, email, passhash });
        await user.save();
        req.session.userId = user._id.toString();
        req.session.userName = user.name;
        res.redirect('/');
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.comparePassword(password)) {
        req.session.userId = user._id.toString();
        req.session.userName = user.name;
        res.redirect('/');
    } else {
        res.status(401).send('Invalid email or password');
    }
}

export const checkSession = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.userId) {
        res.status(401).send('Not authenticated');
    } else {
        next();
    }
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}