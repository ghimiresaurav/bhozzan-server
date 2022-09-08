import { Router } from "express";
import { getRestaurantDetails, registerRestaurant } from "../controllers/restaurant.controllers";

const router: Router = Router();

router.post("/register", registerRestaurant);
router.get("/:restaurantId", getRestaurantDetails);

export default router;
