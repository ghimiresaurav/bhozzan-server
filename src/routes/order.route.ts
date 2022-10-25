import { Router } from "express";
import { placeOrder } from "../controllers/order.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router: Router = Router();

//----------------------------------------AUTHENTICATED USER ROUTE----------------------------------//
router.use(isAuthenticated);

router.post("/create", placeOrder);

export default router;
