import mongoose, { Schema, model } from "mongoose";
import { orderStatusEnum } from "../enums/orderStatusEnum";
import { IOrder, IDishOrder } from "../Interfaces/IOrder";
const { ObjectId } = Schema.Types;

const dishOrderSchema = new Schema<IDishOrder>({
	dishId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	rate: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	type: {
		type: String,
		enum: orderStatusEnum,
	},
});

const orderSchema = new Schema<IOrder>(
	{
		userId: {
			type: ObjectId,
			required: true,
		},
		dishes: {
			type: [dishOrderSchema],
			required: true,
		},
		totalPrice: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: orderStatusEnum,
			default: orderStatusEnum.PENDING,
		},
		restaurant: {
			type: ObjectId,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Order = model<IOrder>("Order", orderSchema);
export default Order;
