import { Router } from 'express';
const router = Router();
import { validateToken } from '../middlewares/authGuard.js';
import {
	getFeedback,
    addFeedback,
    editFeedback,
    getFeedbackByAppointmentId,
    getFeedbackByHairdresserId,
    removeFeedback
} from '../controllers/feedbackController.js';

router.get('/', getFeedback);

router.post('/', validateToken, addFeedback);
router.post('/:id', validateToken, editFeedback);


router.get('/appointment/:id', getFeedbackByAppointmentId);
router.get('/hairdresser/:id', getFeedbackByHairdresserId);

router.delete('/:id', validateToken, removeFeedback);

export default router;