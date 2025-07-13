import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	getAllUsers,
	getUsersByRole,
	registerUser,
	loginUser,
	logoutUser,
	deactivateUser,
} from "../controllers/userController.js";

router.get("/", getAllUsers);

//todo change for obj instead of a param for security
//todo catch error when id is not valid
router.get("/role/:role", validateToken, getUsersByRole);
// router.get("/:id/appointments", validateToken, getUserIdAppointments); À faire SVP
// router.get("/:id/availabilities", validateToken, getUserIdAvailabilities); À faire SVP

router.post("/register", registerUser);
router.post("/login", loginUser); // Renvoie moi le role du user aussi svp

//todo catch invalid token
router.post("/logout", validateToken, logoutUser);

router.delete("/deactivate", validateToken, deactivateUser);
export default router;
