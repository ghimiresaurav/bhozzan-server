import mongoose from "mongoose";

export interface IReservationDTO {
	tableId: mongoose.Schema.Types.ObjectId | string;
	reservedSince: Date;
	reservedUntil: Date;
}

export interface IReservation extends IReservationDTO, mongoose.Document {
	reservedBy: mongoose.Schema.Types.ObjectId;
	cost: number;
}
