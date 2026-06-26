import { Router } from 'express';
import { getLeads } from '../controllers/sheetsController.js';

const router = Router();
router.get('/leads', getLeads);
export default router;
