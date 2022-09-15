import { RequestHandler } from "express";
import { roleEnum } from "../enums/roleEnum";
import { IRestaurant, IRestaurantDTO } from "../Interfaces/IRestaurant";
import { IUserRegistrationDTO } from "../Interfaces/IUser";
import Restaurant from "../Models/Restaurant.model";
import User from "../Models/User.model";
import errorHandlers from "../utils/error-handlers";

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

export const getRestaurantDetails: RequestHandler = async (req, res) => {
	try {
		const { restaurantId }: { restaurantId?: string } = req.params;
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
		const restaurant: IRestaurant = await Restaurant.findById(restaurantId);

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
