import { Router } from 'express';
const router = Router();

import {
    getUsers,
    getTokens,
    getUserById,
} from '../controllers/debugController.js';


router.get('/users', getUsers);
router.get('/tokens', getTokens);
router.get("/:id", getUserById);

// nyi
//router.delete('/user/delete/:id', validateToken, deleteUser)

//router.get('/appointments', GetAppointments);

//router.get('/feedbacks', getFeedbacks);

export default router;