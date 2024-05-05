import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import api from './api.routes';
import views from './views.routes';
import path from 'path';
import mongoose from 'mongoose';

export const startServer = async () => {
    const app = express();

    const port = 8080;
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pix';
    
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    await mongoose.connect(mongoUri);

    app.use(session({
        secret: 'your secret key',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: mongoUri }) as any
    }));

    app.use((req, res, next) => {
        console.log(
            `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
        );
        next();
    });

    app.use('/', api);
    
    app.use(express.static('static'));
    app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap')));
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    app.use('/', views);

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

// Augment express-session with a custom SessionData object
declare module "express-session" {
    interface SessionData {
        userId: string;
        userName: string;
    }
}