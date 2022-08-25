import { Router } from "express";
import { registerUser, handleLogin } from "../controllers/user.controllers";

const router: Router = Router();

router.post("/register", registerUser);
router.post("/login", handleLogin);

export default router;
