import mongoose from "mongoose";

export interface IBasket extends mongoose.Document {
	userId: mongoose.Schema.Types.ObjectId;
	dishes: Array<mongoose.Schema.Types.ObjectId | string>;
}
