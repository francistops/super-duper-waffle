import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	getAllUsers,
	getUsersByRole,
	getUserIdAppointments,
	getUserIdAvailabilities,
	registerUser,
	loginUser,
	logoutUser,
	deactivateUser,
} from "../controllers/userController.js";

router.get("/", getAllUsers);

//todo change for obj instead of a param for security
//todo catch error when id is not valid
router.get("/role/:role", validateToken, getUsersByRole);
router.get("/:id/appointments", validateToken, getUserIdAppointments);
router.get("/:id/availabilities", validateToken, getUserIdAvailabilities);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", validateToken, logoutUser);
router.post("/deactivate", validateToken, deactivateUser);

export default router;