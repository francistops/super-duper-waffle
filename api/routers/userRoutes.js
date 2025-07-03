import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	getUsersByRole,
	getUserById,
	registerUser,
	loginUser,
	logoutUser,
	removeUser,
} from "../controllers/userController.js";

//todo change for obj instead of a param for security
//todo catch error when id is not valid
router.get("/role/:role", validateToken, getUsersByRole);
router.get("/:id", validateToken, getUserById);
// Ajouter la route get users by appointmentId

router.post("/register", registerUser);
router.post("/login", loginUser);

//todo catch invalid token
router.post("/logout", validateToken, logoutUser);

router.delete("/delete", validateToken, removeUser); // Mofifier en 'deactivate' au lieu de delete

export default router;
