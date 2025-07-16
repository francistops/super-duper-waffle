import { Router } from "express";
const router = Router();
import { validateToken } from "../middlewares/authGuard.js";
import { authorizeBy } from "../middlewares/authorize.js";
import {
	addAvailability,
	modifyAvailability,
} from "../controllers/availabilityController.js";

router.post(
	"/add",
	validateToken,
	authorizeBy((req) => req.user.id),
	addAvailability
);
router.patch(
	"/:id",
	validateToken,
	authorizeBy((req) => req.user.id),
	modifyAvailability
);

export default router;
