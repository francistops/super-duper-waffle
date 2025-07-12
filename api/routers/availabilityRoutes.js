import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	getAvailabilities,
	addAvailability,
	editAvailability,

} from "../controllers/availabilityController.js";

router.get("/", getAvailabilities);

router.post("/add", validateToken, addAvailability);
router.post("/:id", validateToken, editAvailability);

export default router;
