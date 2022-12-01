import { Schema, model } from "mongoose";
import { IReservation } from "../Interfaces/IReservation";
const { ObjectId } = Schema.Types;

const reservationSchema = new Schema<IReservation>({
	tableId: {
		type: ObjectId,
		required: true,
		ref: "Table",
	},
	restaurant: {
		type: ObjectId,
		required: true,
		ref: "Restaurant",
	},
	reservedBy: {
		type: ObjectId,
		required: true,
		ref: "User",
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

reservationSchema.pre("save", async function (this, next) {
	// Make sure the reservedSince field is greater than current time
	const rn = new Date();

	const since = new Date(this.reservedSince);
	const until = new Date(this.reservedUntil);

	if (since <= rn) {
		const error: Error = new Error("Invalid starting time.");
		next(error);
	}
	if (until <= since) {
		const error: Error = new Error("Invalid ending time.");
		next(error);
	}

	next();
});

const Reservation = model<IReservation>("Reservation", reservationSchema);
export default Reservation;
