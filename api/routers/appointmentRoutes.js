import { Router } from 'express';
const router = Router();
import { validateToken } from '../middlewares/authGuard.js';
import {
	getAppointments,
    getAppointmentsById,
    putAppointmentStatus,
    getNextAppointments,
    addAppointment,
	editAppointment,
	removeAppointment
} from '../controllers/appointmentController.js';


router.get('/', getAppointments);

//client can see his and hairdresser can see all client by id
router.get('/client/:id', /*validateToken,*/ getAppointmentsById);

//client and hairdresser can see
router.get('/hairdresser/:id', /*validateToken,*/ getAppointmentsById);

// hairdresser can confirm appointment by id
router.put('/:id/status', validateToken, putAppointmentStatus);

router.post('/next/:id', getNextAppointments);

router.post('/create', validateToken, addAppointment);
router.post('/update/:id', validateToken, editAppointment);
router.delete('/:id', validateToken, removeAppointment);


export default router;