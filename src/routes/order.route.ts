import { Router } from "express";
import { placeOrder, getRestaurantOrders, getOrders } from "../controllers/order.controllers";
import { isAuthenticated, isShipper } from "../middlewares/auth.middleware";

const router: Router = Router();

//----------------------------------------AUTHENTICATED USER ROUTE----------------------------------//
router.use(isAuthenticated);

router.post("/create", placeOrder);
router.get("/my-orders", getOrders);

//----------------------------------------SHIPPER ROUTE---------------------------------------------//
router.use(isShipper);

router.get("/restaurant", getRestaurantOrders);

export default router;
