import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	getUsersByRole,
	getUserIdAppointments,
	getUserIdAvailabilities,
	registerUser,
	loginUser,
	logoutUser,
	deactivateUser,
} from "../controllers/userController.js";

router.get("/role/:role", validateToken, getUsersByRole);
router.get("/:id/appointments", validateToken, getUserIdAppointments);
router.get("/:id/availabilities", validateToken, getUserIdAvailabilities);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", validateToken, logoutUser);
router.post("/deactivate", validateToken, deactivateUser);

export default router;
