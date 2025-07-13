import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	getServices,
} from "../controllers/serviceController.js";

router.get("/", getServices);

export default router;