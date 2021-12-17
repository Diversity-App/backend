import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './entities/routes';
import bodyParser from 'body-parser';
import session from 'express-session';
import { User } from './types';
import cookieParser from 'cookie-parser';

const sessionConfig = {
    user: {},
    secret: process.env.COOKIE_SECRET || 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' },
};
declare module 'express-session' {
    export interface SessionData {
        user: User;
    }
}

dotenv.config();

const app = express();

app.use(session(sessionConfig));

app.use(bodyParser.json());
app.use(cookieParser());

app.use(routes);

// login all requests
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});
/*
MongoDB.getById('cars', "_id").then(console.log); */

//toto et cars as collection
