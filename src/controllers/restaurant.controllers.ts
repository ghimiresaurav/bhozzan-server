import { RequestHandler } from "express";
import { IRestaurant, IRestaurantDTO } from "../Interfaces/IRestaurant";
import Restaurant from "../Models/Restaurant.model";
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
