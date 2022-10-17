import mongoose, { Schema, model } from "mongoose";
import { orderStatusEnum } from "../enums/orderStatusEnum";
import { IOrder, IDishOrder } from "../Interfaces/IOrder";
const { ObjectId } = Schema.Types;

const dishOrderSchema = new Schema<IDishOrder>({
	dishId: {
		type: mongoose.Schema.Types.ObjectId,
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
	},
	{
		timestamps: true,
	}
);

const Order = model<IOrder>("Order", orderSchema);
export default Order;
