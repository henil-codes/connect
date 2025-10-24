import { Router } from "express";
import { getUser } from "../controllers/users.js";
import verifyToken from "../middleware/auth.js";
const router = Router();
router.route("/:id").get(verifyToken, getUser);
export default router;
