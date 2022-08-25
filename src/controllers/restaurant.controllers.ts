import { RequestHandler } from "express";
import { IRestaurant, IRestaurantDTO } from "../Interfaces/IRestaurant";
import { IUser } from "../Interfaces/IUser";
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
		console.error(error, "\n");
		return res.status(500).send(errorHandlers(error));
	}
};
