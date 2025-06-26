import { Router } from 'express';
const router = Router();
import { validateToken } from '../middlewares/authGuard.js';
import {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    logoutUser,
    getAllTokens
} from '../controllers/userController.js';

router.get('/'/*, validateToken*/, getAllUsers);
router.get('/token'/*, validateToken*/, getAllTokens);
router.get('/:id', getUserById);

router.post('/register', registerUser);
router.post('/login', loginUser)
router.post('/logout', validateToken, logoutUser)

export default router;