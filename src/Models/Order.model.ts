import mongoose, { Schema, model } from "mongoose";
import { IOrders, IOrder } from "../Interfaces/IOrder";
const { ObjectId } = Schema.Types;

const orderSchema = new Schema<IOrder>({
	dishId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},

	quantity: {
		type: Number,
		required: true,
	},
});

const ordersSchema = new Schema<IOrders>({
	userId: {
		type: ObjectId,
		required: true,
	},
	dishes: {
		type: [orderSchema],
		required: true,
	},
});

const Orders = model<IOrders>("Orders", ordersSchema);
export default Orders;
