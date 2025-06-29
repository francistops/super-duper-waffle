import { Router } from 'express';
const router = Router();
import { validateToken } from '../middlewares/authGuard.js';
import {
    getServices,
    getServicesById,
    getServicesByAppointmentId,
    getServicesByHairdresserId,
	getNextServices,
	addService,
	editService,
	removeService
} from '../controllers/serviceController.js';


router.get('/', getServices);
router.get('/:id', getServicesById);
router.get('/appointment/:id', getServicesByAppointmentId);
router.get('/hairdresser/:id', getServicesByHairdresserId);

router.post('/next/:id', getNextServices);
router.post('/add', /*validateToken,*/ addService);
router.post('/:id', /*validateToken,*/ editService);

router.delete('/:id', /*validateToken,*/ removeService);


export default router;