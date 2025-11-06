import { Router } from "express";
import { getUserPosts, createPost, getFeedPosts, likePost, deletePost, updatePost, getIndividualPost } from "../controllers/posts.js";
import verifyToken from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const postsRouter = Router();

// Apply authentication middleware to all post routes
postsRouter.use(verifyToken);

postsRouter.route("/").get(getFeedPosts);
postsRouter.route("/:id").delete(deletePost).put(updatePost).get(getIndividualPost);
postsRouter.route("/:id/posts").post(upload.single("picturePath"), createPost).get(getUserPosts);
postsRouter.route("/:id/like").patch(likePost);

export default postsRouter;
