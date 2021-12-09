import { Router } from 'express';
import DataController from './data.controller';

const router = Router();

router.get('/infos', DataController.getLikes);

export default router;
