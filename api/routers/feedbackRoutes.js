import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	getFeedbacks,
	addFeedback,
	editFeedback,
	getFeedbackByAppointmentId,
	getFeedbackByHairdresserId,
	removeFeedback,
} from "../controllers/feedbackController.js";

router.get("/", getFeedbacks);
router.post("/", validateToken, addFeedback);

// Pas besoin des routes en dessous
router.post("/:id", validateToken, editFeedback);
router.get("/appointment/:id", getFeedbackByAppointmentId);
router.get("/hairdresser/:id", getFeedbackByHairdresserId);
router.delete("/:id", validateToken, removeFeedback);

export default router;
