import { Router } from 'express';
import { list, create, remove } from '../controllers/contactController.js';

const router = Router();

router.get('/',     list);
router.post('/',    create);
router.delete('/:id', remove);

export default router;
