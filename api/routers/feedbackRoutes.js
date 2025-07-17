import { Router } from "express";
const router = Router();
// import { validateToken } from "../middlewares/authGuard.js";
// import { authorizeBy } from "../middlewares/authorize.js";
import {
	getFeedbacks,
	addFeedback,
} from "../controllers/feedbackController.js";

router.get("/", getFeedbacks);
router.post(
	"/add",
	// validateToken,
	// authorizeBy((req) => req.user.id),
	addFeedback
);

export default router;
