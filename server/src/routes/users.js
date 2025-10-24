import { Router } from "express";
import { getUser } from "../controllers/users.js";

const router = Router();

router.route("/:id").get(getUser);

export default router;
