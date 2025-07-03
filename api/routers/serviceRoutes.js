import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import {
	getServices,
	getServiceById,
	getServiceByAppointmentId,
	addService,
	editService,
	removeService,
} from "../controllers/serviceController.js";

router.get("/", getServices);
router.get("/:id", getServiceById);
router.get("/appointment/:id", getServiceByAppointmentId);

router.post("/add", /*validateToken,*/ addService); // nice to have
router.post("/:id", /*validateToken,*/ editService); // nice to have

router.delete("/:id", /*validateToken,*/ removeService); // nice to have

export default router;
