import { Router } from "express";
import upload from "../middleware/multer.js";
import { register, login } from "../controllers/auth.js";

const authRouter = Router();

authRouter.route("/register").post(upload.single("picture"), register);
authRouter.route("/login").post(login);

export default authRouter;