import { Router } from "express";
import {
	placeOrder,
	getRestaurantOrders,
	getOrders,
	acceptOrder,
	rejectOrder,
	dispatchOrder,
	deliverOrder,
	cancelOrder,
	serveOrder,
} from "../controllers/order.controllers";
import { isAuthenticated, isShipper } from "../middlewares/auth.middleware";

const router: Router = Router();

//----------------------------------------AUTHENTICATED USER ROUTE----------------------------------//
router.use(isAuthenticated);

router.post("/create", placeOrder);
router.get("/my-orders", getOrders);
router.put("/cancel/:orderId", cancelOrder);

//----------------------------------------SHIPPER ROUTE---------------------------------------------//
router.use(isShipper);

router.get("/restaurant", getRestaurantOrders);
router.put("/accept/:orderId", acceptOrder);
router.put("/reject/:orderId", rejectOrder);
router.put("/dispatch/:orderId", dispatchOrder);
router.put("/deliver/:orderId", deliverOrder);
router.put("/serve/:orderId", serveOrder);

export default router;
