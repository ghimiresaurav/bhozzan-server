import { Router } from "express";
import { createRoom } from "../controllers/chat.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";
import messageRoute from "./message.route";

const router: Router = Router();

// Use message route for messages(texts)
router.use("/message", messageRoute);

// ----------------------------AUTHENTICATED USER ROUTE-------------------------//
router.use(isAuthenticated);

router.post("/create-room/:restaurantId", createRoom);

export default router;
