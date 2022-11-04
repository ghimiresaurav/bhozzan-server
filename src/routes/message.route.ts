import { Router } from "express";
import { createNewMessage } from "../controllers/message.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router: Router = Router();

// ----------------------------AUTHENTICATED USER ROUTE-------------------------//
router.use(isAuthenticated);

router.post("/new", createNewMessage);

export default router;
