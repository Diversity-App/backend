import { Router } from 'express';
import AuthController from './auth.controller';
import SsoRoutes from './sso/sso.routes';

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

router.use('/sso', SsoRoutes);

export default router;
