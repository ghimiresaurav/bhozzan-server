import { RequestHandler } from "express";
import mongoose from "mongoose";
import { orderStatusEnum } from "../enums/orderStatusEnum";
import { IDish, IDishDTO } from "../Interfaces/IDish";
import Dish from "../Models/Dish.model";
import Order from "../Models/Order.model";
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
		if (!restaurantId || !isValidObjectId(restaurantId))
			return res.status(400).send("Invalid Restaurant ID");

		const result = await Dish.aggregate([
			{
				$match: {
					restaurant: { $eq: new mongoose.Types.ObjectId(restaurantId) },
				},
			},
			{
				$group: {
					_id: "$category",
					dishes: {
						$push: "$$ROOT",
					},
				},
			},
		]);

		if (!result) return res.status(404).send("Dishes not Found");

		if (!result.length)
			return res.json({
				message: "Dishes of specified restaurant",
				dishes: result,
			});

		return res.json({
			message: "Dishes of specified restaurant",
			result,
		});
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

		const dishes: IDish[] | null = await Dish.find({ category }).populate(
			"restaurant",
			"name address"
		);
		if (!dishes) return res.status(404).send("No Dishes in this Categories");

		return res.json({ message: "Dishes of specified category", dishes });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const getTodays: RequestHandler = async (req, res) => {
	try {
		const todays = await Order.aggregate([
			{
				$match: {
					$and: [
						{ status: { $ne: orderStatusEnum.CANCELED } },
						{ createdAt: { $lt: new Date(new Date().setHours(0, 0, 0)) } },
						{ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0) - 24 * 60 * 60 * 1000) } },
					],
				},
			},
			{ $unwind: "$dishes" },
			{
				$group: {
					_id: "$dishes.dishId",
					total: {
						$sum: "$dishes.quantity",
					},
				},
			},
			{ $sort: { quantity: 1 } },
			{
				$lookup: {
					from: "dishes",
					localField: "_id",
					foreignField: "_id",
					as: "dish",
				},
			},
			{
				$lookup: {
					from: "restaurants",
					localField: "dish.restaurant",
					foreignField: "_id",
					as: "restaurant",
				},
			},
			{
				$project: {
					_id: 0,
					"restaurant.tables": 0,
					"restaurant.dishes": 0,
					"restaurant.reviews": 0,
					"restaurant.shippers": 0,
				},
			},
			{ $limit: 5 },
		]);

		return res.json({ message: "Today's Best Selling Dishes", todays });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};
