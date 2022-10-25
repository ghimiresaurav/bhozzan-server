import { RequestHandler } from "express";
import { roleEnum } from "../enums/roleEnum";
import { IDish } from "../Interfaces/IDish";
import Dish from "../Models/Dish.model";
import Order from "../Models/Order.model";
import errorHandlers from "../utils/error-handlers";
import isValidObjectId from "../utils/isValidObjectId";

export const placeOrder: RequestHandler = async (req, res) => {
	try {
		// If the requesting user is not a customer, do nothing
		if (req.user.role !== roleEnum.CUSTOMER)
			return res.status(400).json({ message: "Invalid User Role" });

		const zzdishes: [{ dishId: string; quantity: number; restaurant?: string }] = req.body;

		// Check if the restaurant id of the first dish is valid
		const restaurant = zzdishes[0].restaurant;
		if (!restaurant || !isValidObjectId(restaurant))
			return res.status(400).json({ message: "Invalid Restaurant id" });

		// Make sure all the dishes are from same restaurant
		// And all the dish ids are valid
		const okay: boolean = zzdishes.every(
			(dish) => isValidObjectId(dish.dishId) && dish.restaurant === restaurant
		);

		if (!okay) return res.status(400).json({ message: "Invalid Dish id or restaurant id" });

		// Create an array
		const dishes = [];
		let totalPrice: number = 0;

		for (let i = 0; i < zzdishes.length; i++) {
			const dish = zzdishes[i];
			const xdish: IDish | null = await Dish.findById(dish.dishId);
			if (!xdish) break;

			// remove restaurant field from dish
			delete dish.restaurant;

			// Calculate price of each dish
			const price = xdish!.price * dish.quantity;
			dishes.push({
				...dish,
				rate: xdish.price,
				price,
			});
			totalPrice += price;
		}

		if (dishes.length !== zzdishes.length)
			return res.status(400).send("Some or all dish not found");

		const order = new Order({
			dishes,
			totalPrice,
			restaurant,
			userId: req.user._id,
		});

		await order.save();

		return res.json({ message: "Your order has been saved.", order });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: errorHandlers(error) });
	}
};

// This is for shippers and restaurant managers
export const getRestaurantOrders: RequestHandler = async (req, res) => {
	try {
		const orders = await Order.find({ restaurant: req.user.restaurant });
		if (!orders) return res.status(404).json({ message: "Orders not found" });

		return res.json({ message: "Orders to your restaurant", orders });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: errorHandlers(error) });
	}
};

// This is for customers to view their orders
export const getOrders: RequestHandler = async (req, res) => {
	try {
		if (req.user.role !== roleEnum.CUSTOMER)
			return res.status(400).json({ message: "Invalid user role" });

		const orders = await Order.find({ userId: req.user._id });
		if (!orders) return res.status(404).json({ message: "Orders not found" });

		return res.json({ message: "Your Orders", orders });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: errorHandlers(error) });
	}
};