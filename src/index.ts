import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './entities/routes';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

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
