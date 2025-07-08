import { Router } from 'express';
const router = Router();
import { validateToken } from '../middlewares/authGuard.js';
import {
	getAvailabilities,
    getAvailabilitiesById,
    putAvailabilitieStatus,
    getNextAvailabilities,
    addAvailabilitie,
	editAvailabilitie,
	removeAvailabilitie
} from '../controllers/AvailabilitieController.js';

router.get('/users/:id', validateToken, getAvailabilities);
router.get('/', validateToken, getAvailabilitiesById);
router.put('/:id', validateToken, getAvailabilitiesById);
router.post('/create', validateToken, addAvailabilitie);


// router.put('/:id/status', validateToken, putAvailabilitieStatus);

// router.post('/update/:id', validateToken, editAvailabilitie);
// router.delete('/delete/:id', validateToken, removeAvailabilitie);


export default router;