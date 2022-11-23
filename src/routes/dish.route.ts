import { Router } from "express";
import {
	addNewDish,
	deleteDishById,
	getTodays,
	updateDish,
	viewAllDishes,
	viewDishById,
	viewDishesByCategory,
	viewDishesByRestaurant,
} from "../controllers/dish.controllers";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware";
import { isVerified } from "../middlewares/isVerified.middleware";

const router: Router = Router();

router.get("/", viewAllDishes);
router.get("/best-selling", getTodays);
router.get("/:dishId", viewDishById);
router.get("/restaurant/:restaurantId", viewDishesByRestaurant);
router.get("/category/:category", viewDishesByCategory);

//--------------------------------------AUTHENTICATED USER ROUTE-------------------------------//
router.use(isAuthenticated);

//--------------------------------------MANAGER ROUTE------------------------------------------//
router.use(isManager, isVerified);

// The following can be only accessed by restaurant managers
router.post("/add", addNewDish);
router.put("/update/:dishId", updateDish);
router.delete("/delete/:dishId", deleteDishById);

export default router;
