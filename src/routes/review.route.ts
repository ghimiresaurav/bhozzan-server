import { Router } from "express";
import { addReview } from "../controllers/review.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/:restaurant", isAuthenticated, addReview);

export default router;
