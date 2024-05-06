import dotenv from 'dotenv';
import { startServer } from './server';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
startServer();
