import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	addAvailability,
	modifyAvailability,
} from "../controllers/availabilityController.js";

router.post("/add", validateToken, addAvailability);
router.patch("/:id", validateToken, modifyAvailability);

export default router;
