import { Router } from "express";
import { getUserPosts, createPost, getFeedPosts } from "../controllers/posts.js";
import verifyToken from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const postsRouter = Router();

// Apply authentication middleware to all post routes
postsRouter.use(verifyToken);

postsRouter.route("/").get(getFeedPosts);
postsRouter.route("/:id/posts").post(upload.single("picturePath"), createPost).get(getUserPosts);

export default postsRouter;
