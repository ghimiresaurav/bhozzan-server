import { Router } from "express";
import { addNewTable, deleteTable, reserveTable } from "../controllers/table.controllers";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/add", isAuthenticated, isManager, addNewTable);
router.delete("/delete/:tableId", isAuthenticated, isManager, deleteTable);
router.post("/reserve", isAuthenticated, reserveTable);

export default router;
