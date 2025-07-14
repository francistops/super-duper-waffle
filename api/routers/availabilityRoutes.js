import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	getAvailabilities,
	addAvailability,
	modifyAvailability,

} from "../controllers/availabilityController.js";

router.get("/", getAvailabilities);

router.post("/add", validateToken, addAvailability);
router.patch("/update", validateToken, modifyAvailability);

export default router;
