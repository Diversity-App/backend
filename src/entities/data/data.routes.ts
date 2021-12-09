import { Router } from 'express';
import DataController from './data.controller';

const router = Router();

router.get('/homePage', DataController.getHomePage);

export default router;
