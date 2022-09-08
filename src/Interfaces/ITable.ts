import mongoose from "mongoose";

export interface ITableDTO {
	seats: number;
	position: string;
	rate: number;
}
export interface ITable extends ITableDTO, mongoose.Document {
	restaurantId: mongoose.Schema.Types.ObjectId;
	// reservedBy: mongoose.Schema.Types.ObjectId;
	// isReserved: boolean;
	// reservedUntil: Date;
}
