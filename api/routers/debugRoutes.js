import { Router } from 'express';
const router = Router();

import {
    getUsers,
    getTokens,
    getUserById,
	getAvailabilities,
	getAppointments,
	getFeedbacks
} from '../controllers/debugController.js';

router.get('/users', getUsers);
router.get('/tokens', getTokens);
router.get('/availabilities', getAvailabilities);
router.get("/appointments", getAppointments);
router.get('/feedbacks', getFeedbacks);
router.get("/:id", getUserById);

export default router;