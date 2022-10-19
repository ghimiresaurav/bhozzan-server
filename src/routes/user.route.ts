import { Router } from "express";
import {
	registerUser,
	handleLogin,
	myFavorites,
	getMyDetails,
} from "../controllers/user.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { favoriteRestaurant } from "../controllers/user.controllers";

const router: Router = Router();

router.post("/register", registerUser);
router.post("/login", handleLogin);
// // router.post("/order", isAuthenticated, order);
router.post("/:restaurantId", isAuthenticated, favoriteRestaurant);
router.get("/myFavorites", isAuthenticated, myFavorites);
router.get("/my-details", isAuthenticated, getMyDetails);

export default router;
