import { Router } from 'express';
const router = Router();
import { validateToken } from '../middlewares/authGuard.js';
import {
    getAllUsers,
    getUserById,
    subscribeUser,
    loginUser,
    logoutUser
} from '../controllers/userController.js';

router.get('/'/*, validateToken*/, getAllUsers);
router.get('/:id', getUserById);

router.post('/subscribe', subscribeUser);
router.post('/login', loginUser)
router.post('/logout', validateToken, logoutUser)

export default router;