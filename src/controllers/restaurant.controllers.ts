import { RequestHandler } from "express";
import { roleEnum } from "../enums/roleEnum";
import { IRestaurant, IRestaurantDTO } from "../Interfaces/IRestaurant";
import { IUserRegistrationDTO } from "../Interfaces/IUser";
import Restaurant from "../Models/Restaurant.model";
import User from "../Models/User.model";
import errorHandlers from "../utils/error-handlers";
import { generateRegex } from "../utils/generateRegex";
import isValidObjectId from "../utils/isValidObjectId";

export const registerRestaurant: RequestHandler = async (req, res) => {
	try {
		const restaurantData: IRestaurantDTO = req.body;

		const restaurant = new Restaurant(restaurantData);
		await restaurant.save();

		return res.json({
			message: "Restaurant Registration Complete",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const getRestaurants: RequestHandler = async (req, res) => {
	try {
		const restaurants = await Restaurant.find({ isVerified: true })
			.populate("dishes")
			.select("-shippers");
		if (!restaurants) return res.status(404).send("Restaurants not found");
		return res.json({ message: "All restaurants", restaurants });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const getAllRestaurants: RequestHandler = async (req, res) => {
	try {
		const restaurants = await Restaurant.find();
		if (!restaurants) return res.status(404).send("Restaurants not found");
		return res.json({ message: "All restaurants", restaurants });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const getRestaurantDetails: RequestHandler = async (req, res) => {
	try {
		const { restaurantId }: { restaurantId?: string } = req.params;
		if (!isValidObjectId(restaurantId)) return res.status(400).send("Invalid Restaurant ID.");

		const restaurant: IRestaurant | null = await Restaurant.findById(restaurantId)
			.populate("dishes")
			.populate("tables");

		return res.json({ restaurant });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const addShipper: RequestHandler = async (req, res) => {
	try {
		const restaurantId = req.user.restaurant;
		const restaurant: IRestaurant | null = await Restaurant.findById(restaurantId);
		if (!restaurant) return res.status(404).send("Restaurant Not Found");

		// Check if the restaurant can add more shippers
		if (restaurant.shippers.count >= restaurant.shippers.limit)
			return res
				.status(405)
				.send("Not Allowed. Your restaurant has reached it's limit on number of shippers.");

		// Extract User Inputs
		const shipperData: IUserRegistrationDTO = {
			...req.body,
			role: roleEnum.SHIPPER,
			password: `shipper@123`,
			restaurant: restaurantId,
		};

		const shipper = new User(shipperData);
		await shipper.save();

		// Update the number of shippers
		await Restaurant.findByIdAndUpdate(restaurantId, {
			$inc: { "shippers.count": 1 },
		});

		return res.json({ message: "New Shipper added successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const verifyRestaurant: RequestHandler = async (req, res) => {
	try {
		const { restaurantId }: { restaurantId?: string } = req.params;
		if (!isValidObjectId(restaurantId))
			return res.status(400).json({ message: "Invalid Restaurant id" });

		const restaurant = await Restaurant.findOneAndUpdate(
			{ _id: restaurantId, isVerified: false },
			{ $set: { isVerified: true } }
		);
		if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

		return res.json({ message: "Restaurant Verified Successfully.", restaurant });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

// Undoes verification
export const refuteRestaurant: RequestHandler = async (req, res) => {
	try {
		const { restaurantId }: { restaurantId?: string } = req.params;
		if (!isValidObjectId(restaurantId))
			return res.status(400).json({ message: "Invalid Restaurant id" });

		const restaurant = await Restaurant.findOneAndUpdate(
			{ _id: restaurantId, isVerified: true },
			{ $set: { isVerified: false } }
		);
		if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

		return res.json({ message: "Restaurant Refuted Successfully.", restaurant });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const searchRestaurantsByName: RequestHandler = async (req, res) => {
	try {
		const { searchQuery }: { searchQuery?: string } = req.params;
		if (!searchQuery) return res.status(400).json({ message: "Invalid Search Query" });

		const query = generateRegex(searchQuery);
		const restaurants = await Restaurant.find({ name: { $regex: query } }).select("-shippers");
		if (!restaurants) return res.status(404).json({ message: "Restaurants not found" });

		return res.json({ message: "Restaurants with matching names.", restaurants });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const updateRestaurant: RequestHandler = async (req, res) => {
	try {
		const updatedRestaurantData = req.body;
		// Manager can only update their own restaurant
		const restaurant: IRestaurant | null = await Restaurant.findByIdAndUpdate(req.user.restaurant, {
			$set: updatedRestaurantData,
		});
		if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

		return res.json({ message: "Restaurant updated successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};
