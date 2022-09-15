import { Router } from "express";
import { getRestaurantDetails, registerRestaurant } from "../controllers/restaurant.controllers";
import { addShipper } from "../controllers/restaurant.controllers";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/register", registerRestaurant);
router.post("/add-shipper", isAuthenticated, isManager, addShipper);
router.get("/:restaurantId", getRestaurantDetails);

export default router;
