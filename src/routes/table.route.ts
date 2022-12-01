import { Router } from "express";
import { addNewTable, deleteTable, getTablesByRestaurant } from "../controllers/table.controllers";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware";
import { isVerified } from "../middlewares/isVerified.middleware";

const router: Router = Router();

//-------------------------------AUTHENTICATED USER ROUTE------------------------------------//
router.use(isAuthenticated);

router.get("/:restaurantId", getTablesByRestaurant);

//-------------------------------MANAGER ROUTE----------------------------------------------//
router.use(isManager, isVerified);

router.post("/add", addNewTable);
router.delete("/delete/:tableId", deleteTable);

export default router;
