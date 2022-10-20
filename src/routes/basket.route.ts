import { Router } from "express";
import { addToBasket, getBasketDishes, removeFromBasket } from "../controllers/basket.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/addToBasket/:dishId", isAuthenticated, addToBasket);
router.post("/removeFromBasket/:dishId", isAuthenticated, removeFromBasket);
router.get("/getBasketDishes", isAuthenticated, getBasketDishes);

export default router;
