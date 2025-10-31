import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { register, login, logout } from "../controllers/auth.js";
import verifyToken from "../middleware/auth.js";

const authRouter = Router();

authRouter.route("/register").post(upload.single("picturePath"), register);
authRouter.route("/login").post(login);
authRouter.route("/logout").post(verifyToken, logout);

export default authRouter;