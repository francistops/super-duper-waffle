import { Router } from "express";
const router = Router();
import {
	getServices,
} from "../controllers/serviceController.js";

router.get("/", getServices);

export default router;