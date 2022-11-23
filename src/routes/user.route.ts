import { Router } from "express";
import {
	registerUser,
	handleLogin,
	myFavorites,
	getMyDetails,
	removeFromFavorite,
	refreshToken,
} from "../controllers/user.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { favoriteRestaurant } from "../controllers/user.controllers";

const router: Router = Router();

//-------------------------------UNAUTHENTICATED ROUTE---------------------------------------//
router.post("/register", registerUser);
router.post("/login", handleLogin);
router.post("/refresh", refreshToken);
// // router.post("/order", isAuthenticated, order);

//-------------------------------AUTHENTICATED USER ROUTE-------------------------------------//
router.use(isAuthenticated);

router.post("/favorite/:restaurantId", favoriteRestaurant);
router.delete("/favorite/:restaurantId", removeFromFavorite);
router.get("/favorite", myFavorites);

router.get("/my-details", getMyDetails);

export default router;
