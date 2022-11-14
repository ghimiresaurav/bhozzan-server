import { Router } from "express";
import { addNewTable, deleteTable, getTablesByRestaurant } from "../controllers/table.controllers";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware";

const router: Router = Router();

router.get("/:restaurantId", isAuthenticated, getTablesByRestaurant);
router.post("/add", isAuthenticated, isManager, addNewTable);
router.delete("/delete/:tableId", isAuthenticated, isManager, deleteTable);

export default router;
