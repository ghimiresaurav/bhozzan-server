import { Router } from "express";
import {
	addToBasket,
	getBasketRestaurant,
	removeFromBasket,
} from "../controllers/basket.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router: Router = Router();

router.get("/", isAuthenticated, getBasketRestaurant);
router.post("/:dishId", isAuthenticated, addToBasket);
router.delete("/:dishId", isAuthenticated, removeFromBasket);

export default router;
