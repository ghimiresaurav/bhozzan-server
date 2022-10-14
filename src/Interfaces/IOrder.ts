import mongoose from "mongoose";

export interface IOrder {
	dishId: mongoose.Schema.Types.ObjectId;
	quantity: number;
}

export interface IOrders extends mongoose.Document {
	userId: mongoose.Schema.Types.ObjectId;
	dishes: [IOrder];
}
