import express from 'express';
import dotenv from 'dotenv';
import routes from './entities/routes';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(routes);

app.listen(3000, () => {
    console.log('listening on port 3000');
});
