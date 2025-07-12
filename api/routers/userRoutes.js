import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	getAllUsers,
	getUsersByRole,
	getUserById,
	registerUser,
	loginUser,
	logoutUser,
	removeUser,
} from "../controllers/userController.js";

router.get("/", getAllUsers);

//todo change for obj instead of a param for security
//todo catch error when id is not valid
router.get("/role/:role", validateToken, getUsersByRole);
router.get("/:id", validateToken, getUserById);
// router.get("/:id/appointments", validateToken, getUserIdAppointments); À faire SVP
// router.get("/:id/availabilities", validateToken, getUserIdAvailabilities); À faire SVP

router.post("/register", registerUser);
router.post("/login", loginUser); // Renvoie moi le role du user aussi svp

//todo catch invalid token
router.post("/logout", validateToken, logoutUser);
// router.post("/update", validateToken, updateUser); // À faire svp

router.delete("/delete", validateToken, removeUser); // Mofifier en 'deactivate' au lieu de delete

export default router;
