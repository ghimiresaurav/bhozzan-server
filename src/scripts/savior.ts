import connectDB from "../db/connectDB";
import Dish from "../Models/Dish.model";
import Order from "../Models/Order.model";
import * as dotenv from "dotenv";
dotenv.config();

connectDB();
const saveUs = async () => {
	const orders = await Order.find();
	orders.forEach(async (order) => {
		order.dishes.forEach(async (dish) => {
			const xdish = await Dish.findById(dish.dishId);
			if (!xdish) {
				await Order.findByIdAndDelete(order._id);
			}
		});
	});
};

saveUs();
