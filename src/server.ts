import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import router from './routes';
import path from 'path';

export const startServer = async () => {
    const app = express();
    const port = 8000;

    app.use(bodyParser.json());
    app.use(session({
        secret: 'your secret key',
        resave: false,
        saveUninitialized: false,
    }));

    app.use((req, res, next) => {
        console.log(
            `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
        );
        next();
    });
    
    app.use(express.static('static'));

    app.use('/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap')));

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use('/', router)

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

// Augment express-session with a custom SessionData object
declare module "express-session" {
    interface SessionData {
        userId: string;
    }
}