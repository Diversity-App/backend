import { Router } from 'express';
import GoogleController from './google.controller';
import { verifyToken } from '../../../../tools/auth.tools';

const router = Router();

router.get('/login', GoogleController.getCode);

router.get('/callback', verifyToken, GoogleController.getToken);

export default router;
