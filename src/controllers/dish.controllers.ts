import { RequestHandler } from "express";
import { IDish, IDishDTO } from "../Interfaces/IDish";
import Dish from "../Models/Dish.model";
import Restaurant from "../Models/Restaurant.model";
import errorHandlers from "../utils/error-handlers";

export const addNewDish: RequestHandler = async (req, res) => {
	try {
		// Get the id of the restaurant
		const restaurantId = req.user.restaurant;
		const dishData: IDish = { ...req.body, restaurantId };

		// Include the restaurant id in the dish info before saving to the database
		const dish = new Dish(dishData);
		await dish.save();

		// Save the id of the newly added dish to the list of dishes
		await Restaurant.findByIdAndUpdate(restaurantId, {
			$push: { dishes: dish._id },
		});

		return res.json({ message: "New Dish Added Successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const viewAllDishes: RequestHandler = async (req, res) => {
	// 	try {
	// 		console.log(req.originalUrl);
	// 		const restaurantId = req.params.restaurant;
	// 		const dishes: IDish[] = await Dish.find({ restaurantId });
	// 		return res.json({ dishes });
	// 	} catch (error) {
	// 		console.error(error);
	// 		return res.status(500).send(errorHandlers(error));
	// 	}
};
