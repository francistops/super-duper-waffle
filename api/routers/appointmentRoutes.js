import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import { authorizeBy } from "../middlewares/authorize.js";
import {
	addAppointment,
	modifyAppointment,
} from "../controllers/appointmentController.js";

router.post(
	"/add",
	validateToken,
	authorizeBy((req) => req.user.id),
	addAppointment
);
router.patch(
	"/:id",
	validateToken,
	authorizeBy((req) => req.user.id),
	modifyAppointment
);

export default router;
