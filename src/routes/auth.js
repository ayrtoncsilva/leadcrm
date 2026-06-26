import { Router } from 'express';
import { redirectToGoogle, handleCallback, disconnect } from '../controllers/authController.js';

const router = Router();

router.get('/google',           redirectToGoogle);
router.get('/google/callback',  handleCallback);
router.post('/google/disconnect', disconnect);

export default router;
