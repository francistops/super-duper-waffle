import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import { authorizeBy } from "../middlewares/authorize.js";
import {
	getUsersByRole,
	getUserIdAppointments,
	getUserIdAvailabilities,
	registerUser,
	loginUser,
	logoutUser,
	deactivateUser,
} from "../controllers/userController.js";

router.get(
	"/role/:role",
	validateToken,
	authorizeBy((req) => req.user.id),
	getUsersByRole
);
router.get(
	"/:id/appointments",
	validateToken,
	authorizeBy((req) => req.user.id),
	getUserIdAppointments
);
router.get(
	"/:id/availabilities",
	validateToken,
	authorizeBy((req) => req.user.id),
	getUserIdAvailabilities
);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post(
	"/logout",
	validateToken,
	authorizeBy((req) => req.user.id),
	logoutUser
);
router.post(
	"/deactivate",
	validateToken,
	authorizeBy((req) => req.user.id),
	deactivateUser
);

export default router;
