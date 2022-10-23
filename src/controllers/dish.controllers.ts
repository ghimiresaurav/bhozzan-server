import { RequestHandler } from "express";
import { IDish, IDishDTO } from "../Interfaces/IDish";
import Dish from "../Models/Dish.model";
import Restaurant from "../Models/Restaurant.model";
import errorHandlers from "../utils/error-handlers";
import isValidObjectId from "../utils/isValidObjectId";

export const addNewDish: RequestHandler = async (req, res) => {
	try {
		// Get the id of the restaurant
		const restaurantId = req.user.restaurant;
		const dishData: IDish = { ...req.body, restaurant: restaurantId };

		// Include the restaurant id in the dish info before saving to the database
		const dish = new Dish(dishData);
		await dish.save();

		// Save the id of the newly added dish to the list of dishes
		await Restaurant.findByIdAndUpdate(restaurantId, {
			$push: { dishes: dish._id },
		});

		return res.json({ message: "New Dish Added Successfully", dish });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const viewAllDishes: RequestHandler = async (req, res) => {
	try {
		const dishes = await Dish.find({}).populate("restaurant");
		if (!dishes) return res.status(404).send("Dishes not found");

		return res.json({ dishes });
	} catch (error) {}
};

export const viewDishesByRestaurant: RequestHandler = async (req, res) => {
	try {
		const { restaurantId }: { restaurantId?: string } = req.params;
		if (!isValidObjectId(restaurantId)) return res.status(400).send("Invalid Restaurant ID");

		const dishes: IDish[] | null = await Dish.find({ restaurant: restaurantId }).sort({
			category: 1,
		});
		if (!dishes) return res.status(404).send("Dishes not Found");

		return res.json({ message: "Dishes of specified restaurant", dishes });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const viewDishById: RequestHandler = async (req, res) => {
	try {
		const { dishId }: { dishId?: string } = req.params;
		if (!isValidObjectId(dishId)) return res.status(400).send("Invalid Dish ID");

		const dish: IDish | null = await Dish.findById(dishId).populate("restaurant");
		if (!dish) return res.status(404).send("Dish not found");

		return res.json({ dish });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const updateDish: RequestHandler = async (req, res) => {
	try {
		const { dishId }: { dishId?: string } = req.params;
		if (!isValidObjectId(dishId)) return res.status(400).send("Invalid Dish ID");

		const updatedDishData: IDish = req.body;
		const updatedDish: IDish | null = await Dish.findOneAndUpdate(
			{ _id: dishId, restaurant: req.user.restaurant },
			{ $set: updatedDishData }
		);
		if (!updatedDish) return res.status(404).send("Dish not found!");

		return res.json({ message: "Dish updated successfully", updatedDish });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const deleteDishById: RequestHandler = async (req, res) => {
	try {
		const { dishId }: { dishId?: string } = req.params;
		const restaurantId = req.user.restaurant;
		if (!isValidObjectId(dishId)) return res.status(400).send("Invalid Dish ID");

		const deletedDish = await Dish.findOneAndDelete({
			_id: dishId,
			restaurant: req.user.restaurant,
		});

		if (!deletedDish) return res.status(404).send("Dish not found");

		await Restaurant.findByIdAndUpdate(restaurantId, {
			$pull: { dishes: dishId },
		});

		return res.json({ message: "Dish deleted successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const viewDishesByCategory: RequestHandler = async (req, res) => {
	try {
		const { category }: { category?: string } = req.params;

		const dishes: IDish[] | null = await Dish.find({ category });
		if (!dishes) return res.status(404).send("No Dishes in this Categories");

		return res.json({ message: "Dishes of specified category", dishes });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};
