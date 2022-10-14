import { Router } from "express";
import { registerUser, handleLogin, order } from "../controllers/user.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/register", registerUser);
router.post("/login", handleLogin);
router.post("/order", isAuthenticated, order);

export default router;
