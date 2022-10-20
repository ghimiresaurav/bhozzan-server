import { Router } from "express";
import {
	createReservation,
	getReservationsByRestaurant,
	getReservationsByTable,
} from "../controllers/reservation.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/create", isAuthenticated, createReservation);
router.get("/table/:tableId", isAuthenticated, getReservationsByTable);
router.get("/restaurant/:restaurantId", isAuthenticated, getReservationsByRestaurant);
export default router;
