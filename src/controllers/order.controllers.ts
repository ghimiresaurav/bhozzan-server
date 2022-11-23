import { RequestHandler } from "express";
import mongoose, { ObjectId } from "mongoose";
import { orderStatusEnum } from "../enums/orderStatusEnum";
import { roleEnum } from "../enums/roleEnum";
import { IDish } from "../Interfaces/IDish";
import Dish from "../Models/Dish.model";
import Order from "../Models/Order.model";
import { sendNotification } from "../socketServer";
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
		// Get the status which is sent in query
		const { status }: { status?: string } = req.query;

		// If status is non-empty but is not among orderStatusEnu,
		if (status && !Object.values(orderStatusEnum).includes(<orderStatusEnum>status))
			return res.status(400).json({ message: "Invalid order status" });

		// Create a query object
		let query: { restaurant: ObjectId | undefined; status?: string } = {
			restaurant: req.user.restaurant,
		};
		// If status is non-empty, include the status in query
		if (status) query.status = status;

		// Find the orders by the query
		const orders = await Order.find(query)
			.populate("dishes.dishId", "name category")
			.sort({ updatedAt: -1 });
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

		const orders = await Order.find({ userId: req.user._id })
			.populate("dishes.dishId", "name category")
			.populate("restaurant", "name address primaryPhoneNumber")
			.sort({ updatedAt: -1 });

		if (!orders) return res.status(404).json({ message: "Orders not found" });

		return res.json({ message: "Your Orders", orders });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: errorHandlers(error) });
	}
};

export const acceptOrder: RequestHandler = async (req, res) => {
	try {
		if (req.user.role === roleEnum.ADMIN)
			return res.status(401).json({ message: "Invalid User Role" });

		const { orderId }: { orderId?: string } = req.params;
		if (!orderId || !isValidObjectId(orderId))
			return res.status(400).json({ message: "Invalid Order id" });

		const order = await Order.findOneAndUpdate(
			// 	// Make sure the order is to the same restaurant as the requesing user's
			// 	// Also make sure the order is pending
			{ _id: orderId, restaurant: req.user.restaurant, status: orderStatusEnum.PENDING },
			{ $set: { status: orderStatusEnum.ACCEPTED } }
		);
		if (!order) return res.status(404).json({ message: "Order not found" });

		// Notify user that their order has been accepted by the restaurant
		sendNotification(order.userId.toString(), { message: `Your order has been accepted`, order });

		return res.json({ message: "Order has been accepted successfully.", order });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: errorHandlers(error) });
	}
};

export const rejectOrder: RequestHandler = async (req, res) => {
	try {
		if (req.user.role === roleEnum.ADMIN)
			return res.status(401).json({ message: "Invalid User Role" });

		const { orderId }: { orderId?: string } = req.params;
		if (!orderId || !isValidObjectId(orderId))
			return res.status(400).json({ message: "Invalid Order id" });

		const order = await Order.findOneAndUpdate(
			// 	// Make sure the order is to the same restaurant as the requesing user's
			// 	// Also make sure the order is pending
			{ _id: orderId, restaurant: req.user.restaurant, status: orderStatusEnum.PENDING },
			{ $set: { status: orderStatusEnum.REJECTED } }
		);
		if (!order) return res.status(404).json({ message: "Order not found" });

		return res.json({ message: "Order has been rejected successfully.", order });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: errorHandlers(error) });
	}
};

export const dispatchOrder: RequestHandler = async (req, res) => {
	try {
		if (req.user.role === roleEnum.ADMIN)
			return res.status(401).json({ message: "Invalid User Role" });

		const { orderId }: { orderId?: string } = req.params;
		if (!orderId || !isValidObjectId(orderId))
			return res.status(400).json({ message: "Invalid Order id" });

		// Update order status
		// Make sure the order is to the same restaurant, and has already been accepted
		const order = await Order.findOneAndUpdate(
			{ _id: orderId, restaurant: req.user.restaurant, status: orderStatusEnum.ACCEPTED },
			{
				$set: { status: orderStatusEnum.OTW },
			}
		);
		if (!order) return res.status(404).json({ message: "Order not found" });

		return res.json({ message: "Order dispatched successfully", order });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: errorHandlers(error) });
	}
};

export const deliverOrder: RequestHandler = async (req, res) => {
	try {
		if (req.user.role === roleEnum.ADMIN)
			return res.status(401).json({ messaage: "Invalid User Role" });

		const { orderId }: { orderId?: string } = req.params;
		if (!orderId || !isValidObjectId(orderId))
			return res.status(400).json({ message: "Invalid Order id" });

		const order = await Order.findOneAndUpdate(
			{
				_id: orderId,
				// Make sure the order is to the same restaurant
				restaurant: req.user.restaurant,
				// Also make sure that the order is either Accepted or On The Way
				status: { $in: [orderStatusEnum.OTW, orderStatusEnum.ACCEPTED] },
			},
			{ $set: { status: orderStatusEnum.DELIVERED } }
		);
		if (!order) return res.status(404).json({ message: "Order not found" });

		return res.json({ message: "Delivery Completed.", order });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: errorHandlers(error) });
	}
};

export const serveOrder: RequestHandler = async (req, res) => {
	try {
		if (req.user.role === roleEnum.ADMIN)
			return res.status(401).json({ messaage: "Invalid User Role" });

		const { orderId }: { orderId?: string } = req.params;
		if (!orderId || !isValidObjectId(orderId))
			return res.status(400).json({ message: "Invalid Order id" });

		const order = await Order.findOneAndUpdate(
			{
				_id: orderId,
				// Make sure the order is to the same restaurant
				restaurant: req.user.restaurant,
				// Also make sure that the order is either Accepted or On The Way
				status: orderStatusEnum.ACCEPTED,
			},
			{ $set: { status: orderStatusEnum.SERVED } }
		);
		if (!order) return res.status(404).json({ message: "Order not found" });

		return res.json({ message: "Order Served.", order });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: errorHandlers(error) });
	}
};

export const cancelOrder: RequestHandler = async (req, res) => {
	try {
		if (req.user.role !== roleEnum.CUSTOMER)
			return res.status(401).json({ message: "Invalid User Role" });

		const { orderId }: { orderId?: string } = req.params;
		if (!orderId || !isValidObjectId(orderId))
			return res.status(400).json({ message: "Invalid Order id" });

		// Update order status to canceled
		const order = await Order.findOneAndUpdate(
			// Make sure the order was placed by the requesting user
			{ _id: orderId, userId: req.user._id, status: { $in: [orderStatusEnum.PENDING] } },
			{
				$set: { status: orderStatusEnum.CANCELED },
			}
		);
		if (!order) return res.status(404).json({ message: "Order not found" });

		return res.json({ message: "Order Canceled Successfully", order });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: errorHandlers(error) });
	}
};
