import { Router } from "express";
import {
	cancleReservation,
	createReservation,
	getAllReservationsByTable,
	getReservationsByTable,
} from "../controllers/reservation.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/create", isAuthenticated, createReservation);
router.delete("/:reservationId", isAuthenticated, cancleReservation);
router.get("/table/:tableId", isAuthenticated, getReservationsByTable);
router.get("/table/all/:tableId", isAuthenticated, getAllReservationsByTable);

export default router;
