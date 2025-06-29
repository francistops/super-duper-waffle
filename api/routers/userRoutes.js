import { Router } from 'express';
const router = Router();
import { validateToken } from '../middlewares/authGuard.js';
import {
    getUsersByRole,
    getUserById,
    registerUser,
    loginUser,
    logoutUser
} from '../controllers/userController.js';

router.get('/role/:role', validateToken, getUsersByRole);
router.get('/:id', /*validateToken,*/ getUserById);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', validateToken, logoutUser);

// nyi
//router.delete('/delete', validateToken, deleteUser)

export default router;