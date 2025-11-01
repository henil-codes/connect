import { Router } from "express";
import { getCurrentUser, updateProfilePicture, updateUserDetails } from "../controllers/users.js";
import { changePassword } from "../controllers/auth.js";
import verifyToken from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const authRouter = Router();

authRouter.use(verifyToken);

authRouter.route("/:id").get(getCurrentUser);
authRouter.route("/:id/profile-picture").put(upload.single("picturePath"), updateProfilePicture);
authRouter.route("/:id/details").put(updateUserDetails);
authRouter.route("/:id/change-password").put(changePassword);

export default authRouter;
