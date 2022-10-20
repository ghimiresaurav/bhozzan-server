import { Router } from "express";
import { createReservation, getReservationsByTable } from "../controllers/reservation.controllers";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/create", isAuthenticated, createReservation);
router.get("/table/:tableId", isAuthenticated, getReservationsByTable);
export default router;
