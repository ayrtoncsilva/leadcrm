import { Router } from 'express';
import { getStatus, getEvents } from '../controllers/calendarController.js';

const router = Router();

router.get('/status', getStatus);
router.get('/events', getEvents);

export default router;
