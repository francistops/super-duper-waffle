import { Router } from 'express';
const router = Router();
import { validateToken } from '../middlewares/authGuard.js';
import {
    debugGetAllTasks,
    getAllTasksByProject,
    getAllTasksByUser,
    getNextTasks,
    createTask
} from '../controllers/taskController.js';


router.get('/', debugGetAllTasks);
router.get('/:id', getAllTasksByProject);
router.get('/:id', validateToken, getAllTasksByUser);
router.post('/next', getNextTasks);
router.post('/create', validateToken, createTask);


// router.post('/', validateToken, createPost);
// router.post('/:id', validateToken, updatePost);
// router.post('/:id/publish', validateToken, publishPost);
// router.delete('/:id', validateToken, deletePost);

export default router;