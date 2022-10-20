import { Schema, model } from "mongoose";
import { IReservation } from "../Interfaces/IReservation";
const { ObjectId } = Schema.Types;

const reservationSchema = new Schema<IReservation>({
	tableId: {
		type: ObjectId,
		required: true,
	},
	restaurantId: {
		type: ObjectId,
		required: true,
	},
	reservedBy: {
		type: ObjectId,
		required: true,
	},
	reservedSince: {
		type: Date,
		required: true,
	},
	reservedUntil: {
		type: Date,
		required: true,
	},
	cost: {
		type: Number,
		required: true,
	},
});

const Reservation = model<IReservation>("Reservation", reservationSchema);
export default Reservation;
