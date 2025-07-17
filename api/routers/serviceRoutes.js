import { Router } from "express";
const router = Router();
import { getServices, addServices } from "../controllers/serviceController.js";

router.get("/", getServices);
router.post("/add", addServices);

export default router;
