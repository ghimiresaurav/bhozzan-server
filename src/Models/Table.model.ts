import { Schema, model } from "mongoose";
import { ITable } from "../Interfaces/ITable";
const { ObjectId } = Schema.Types;

const tableSchema = new Schema<ITable>({
	restaurantId: {
		type: ObjectId,
		required: true,
	},
	seats: {
		type: Number,
		required: true,
	},
	rate: {
		type: Number,
		required: true,
	},
	reservations: {
		type: [ObjectId],
		default: [],
		ref: "Reservation",
	},
	isReserved: {
		type: Boolean,
		default: false,
	},
	name: {
		type: String,
		required: true,
	},
});

const Table = model<ITable>("Table", tableSchema);
export default Table;
