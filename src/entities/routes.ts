import { Router } from 'express';
import AuthRoutes from './auth/auth.routes';
import { verifyToken } from '../tools/auth.tools';
import DataRoutes from './data/data.routes';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/data', verifyToken, DataRoutes);

export default router;
