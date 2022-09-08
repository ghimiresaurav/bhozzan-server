import { Router } from "express";
import { addNewDish, viewAllDishes } from "../controllers/dish.controllers";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/add", isAuthenticated, isManager, addNewDish);
// router.get("/", viewAllDishes);

export default router;
