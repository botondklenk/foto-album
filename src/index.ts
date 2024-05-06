import dotenv from 'dotenv';
import { startServer } from './server';

if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
}
startServer();
