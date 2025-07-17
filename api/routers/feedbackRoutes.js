import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	getFeedbacks,
	addFeedback,
} from "../controllers/feedbackController.js";

router.get("/", getFeedbacks);
router.post("/add", validateToken, addFeedback);

export default router;
