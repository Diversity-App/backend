import express, { application } from "express";
import { connectToDatabase } from "./services/database.service"
import { clientsRouter } from "./routes/clients.router";
import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './entities/routes';
import bodyParser from 'body-parser';
import session from 'express-session';
import { User } from './types';

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

app.use(routes);

// login all requests
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.listen(8080, () => {
    console.log('listening on port 8080');
});


connectToDatabase()
    .then(() => {
        application.use("/clients", clientsRouter);

        application.listen(9090, () => {
            console.log(`Server started at http://localhost:${9090}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection broke", error);
        process.exit();
    });