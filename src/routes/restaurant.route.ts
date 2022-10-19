import { Router } from "express";
import {
	getRestaurants,
	getRestaurantDetails,
	registerRestaurant,
	getAllRestaurants,
} from "../controllers/restaurant.controllers";
import { addShipper } from "../controllers/restaurant.controllers";
import { isAdmin, isAuthenticated, isManager } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/register", registerRestaurant);
router.post("/add-shipper", isAuthenticated, isManager, addShipper);
router.get("/list", getRestaurants);
router.get("/list/all", isAuthenticated, isAdmin, getAllRestaurants);
router.get("/:restaurantId", getRestaurantDetails);

export default router;
