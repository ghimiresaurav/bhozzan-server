import mongoose from "mongoose";
import { orderStatusEnum } from "../enums/orderStatusEnum";
import { orderTypeEnum } from "../enums/orderTypeEnum";

export interface IDishOrder {
	dishId: mongoose.Schema.Types.ObjectId;
	rate: number;
	quantity: number;
	price: number;
	type: orderTypeEnum;
}

export interface IOrder extends mongoose.Document {
	userId: mongoose.Schema.Types.ObjectId;
	dishes: [IDishOrder];
	totalPrice: number;
	status: orderStatusEnum;
	restaurant: mongoose.Schema.Types.ObjectId;
}
