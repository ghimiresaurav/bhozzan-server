import { Router } from "express";
import {
	cancleReservation,
	createReservation,
	getAllReservationsByTable,
	getMyReservations,
	getReservationsByTable,
} from "../controllers/reservation.controllers";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware";
import { isVerified } from "../middlewares/isVerified.middleware";

const router: Router = Router();

//-------------------------------AUTHENTICATED USER ROUTE------------------------------------//
router.use(isAuthenticated);

router.post("/create", createReservation);
router.delete("/:reservationId", cancleReservation);
router.get("/table/:tableId", getReservationsByTable);
router.get("/my", getMyReservations);

//-------------------------------MANAGER ROUTE-----------------------------------------------//
router.use(isManager, isVerified);

router.get("/table/all/:tableId", getAllReservationsByTable);

export default router;
