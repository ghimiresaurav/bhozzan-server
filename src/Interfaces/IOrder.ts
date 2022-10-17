import mongoose from "mongoose";
import { orderStatusEnum } from "../enums/orderStatusEnum";

export interface IDishOrder {
	dishId: mongoose.Schema.Types.ObjectId;
	quantity: number;
	price: number;
}

export interface IOrder extends mongoose.Document {
	userId: mongoose.Schema.Types.ObjectId;
	dishes: [IDishOrder];
	totalPrice: number;
	status: orderStatusEnum;
}
