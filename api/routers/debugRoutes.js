import { Router } from "express";
const router = Router();

import {
	getUsers,
	getTokens,
	getAvailabilities,
	getAppointments,
	getUserById,
} from "../controllers/debugController.js";

import { authorizeBy } from '../middlewares/authorize.js'
import { validateToken } from "../middlewares/authGuard.js";

router.get("/users", getUsers);
router.get("/tokens", getTokens);
router.get("/availabilities", getAvailabilities);
router.get("/appointments", getAppointments);
router.get("/:id", getUserById);

export default router;
