import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	addAppointment,
	modifyAppointment,	

} from "../controllers/appointmentController.js";

router.post("/add", validateToken, addAppointment);
router.patch("/update", validateToken, modifyAppointment);

export default router;
