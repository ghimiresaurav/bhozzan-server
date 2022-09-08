import { Router } from "express";
import { addNewTable } from "../controllers/table.controllers";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/add", isAuthenticated, isManager, addNewTable);

export default router;
