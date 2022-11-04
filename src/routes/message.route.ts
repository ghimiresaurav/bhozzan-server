import { Router } from "express";
import { createNewMessage, getMessages } from "../controllers/message.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router: Router = Router();

// ----------------------------AUTHENTICATED USER ROUTE-------------------------//
router.use(isAuthenticated);

router.post("/new", createNewMessage);
router.get("/:chatId", getMessages);

export default router;
