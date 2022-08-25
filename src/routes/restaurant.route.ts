import { Router } from "express";
import { registerRestaurant } from "../controllers/restaurant.controllers";
const router: Router = Router();

router.post("/register", registerRestaurant);

export default router;
