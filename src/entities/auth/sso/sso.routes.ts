import { Router } from 'express';
import GoogleRouter from './google/google.routes';

const router = Router();

router.use('/google', GoogleRouter);

export default router;
