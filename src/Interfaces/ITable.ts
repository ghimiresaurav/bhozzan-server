import mongoose from "mongoose";

export interface ITableDTO {
	seats: number;
	name: string;
	rate: number;
}
export interface ITable extends ITableDTO, mongoose.Document {
	restaurantId: mongoose.Schema.Types.ObjectId;
	reservations: Array<mongoose.Schema.Types.ObjectId | string>;
	isReserved: boolean;
}
