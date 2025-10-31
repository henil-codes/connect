import { Router } from "express";
import { getCurrentUser } from "../controllers/users.js";
import verifyToken from "../middleware/auth.js";

const authRouter = Router();
authRouter.route("/:id").get(verifyToken, getCurrentUser);

export default authRouter;
