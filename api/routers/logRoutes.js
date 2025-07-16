import { Router } from "express";
const router = Router();
//import { validateToken } from "../middlewares/authGuard.js";
// import { authorizeBy } from "../middlewares/authorize.js";
import { getLogs, sendLog } from "../controllers/logController.js";

router.get("/", getLogs);
router.post("/", sendLog);

export default router;
