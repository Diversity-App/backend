import { Router } from 'express';
import DataController from './data.controller';

const router = Router();

router.get('/homePage', DataController.getHomePage);
router.get('/likes', DataController.getLikedPlaylists);

export default router;
