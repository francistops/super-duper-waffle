import { Router } from 'express';
const router = Router();

import {
    getUsers,
    getTokens
} from '../controllers/debugController.js';


router.get('/users', getUsers);
router.get('/tokens', getTokens);

// nyi
//router.delete('/user/delete/:id', validateToken, deleteUser)

//router.get('/appointments', GetAppointments);

//router.get('/feedbacks', getFeedbacks);

export default router;