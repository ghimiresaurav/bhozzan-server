import { Router } from "express";
import {
	cancleReservation,
	createReservation,
	getAllReservationsByTable,
	getReservationsByTable,
} from "../controllers/reservation.controllers";
import { isAuthenticated, isManager } from "../middlewares/auth.middleware";

const router: Router = Router();

//-------------------------------AUTHENTICATED USER ROUTE------------------------------------//
router.use(isAuthenticated);

router.post("/create", createReservation);
router.delete("/:reservationId", cancleReservation);
router.get("/table/:tableId", getReservationsByTable);

//-------------------------------MANAGER ROUTE-----------------------------------------------//
router.use(isManager);

router.get("/table/all/:tableId", getAllReservationsByTable);

export default router;
