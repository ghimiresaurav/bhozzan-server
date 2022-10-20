import { Router } from "express";
import {
	getRestaurants,
	getRestaurantDetails,
	registerRestaurant,
	getAllRestaurants,
	verifyRestaurant,
	refuteRestaurant,
	searchRestaurantsByName,
	updateRestaurant,
} from "../controllers/restaurant.controllers";
import { addShipper } from "../controllers/restaurant.controllers";
import { isAdmin, isAuthenticated, isManager } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/register", registerRestaurant);
router.get("/list", getRestaurants);
router.get("/:restaurantId", getRestaurantDetails);
router.get("/search/:searchQuery", searchRestaurantsByName);

// ----------------------------AUTHENTICATED USER ROUTE-------------------------
router.use(isAuthenticated);

// ----------------------------MANAGER ROUTE------------------------------------
router.use(isManager);
router.post("/add-shipper", addShipper);
router.put("/update", updateRestaurant);

// ----------------------------ADMIN ROUTE--------------------------------------
router.use(isAdmin);
router.get("/list/all", getAllRestaurants);
router.put("/verify/:restaurantId", verifyRestaurant);
router.put("/refute/:restaurantId", refuteRestaurant);

export default router;
