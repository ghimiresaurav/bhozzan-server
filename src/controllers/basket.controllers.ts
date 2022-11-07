import { RequestHandler } from "express";
import mongoose from "mongoose";
import { roleEnum } from "../enums/roleEnum";
import { IBasket } from "../Interfaces/IBasket";
import Baskets from "../Models/Basket.model";
import Basket from "../Models/Basket.model";
import Dish from "../Models/Dish.model";
import errorHandlers from "../utils/error-handlers";
import isValidObjectId from "../utils/isValidObjectId";

export const addToBasket: RequestHandler = async (req, res) => {
	try {
		if (req.user.role !== roleEnum.CUSTOMER) return res.status(400).send("Invalid User Role");

		const { dishId }: { dishId?: string } = req.params;
		if (!isValidObjectId(dishId)) return res.status(400).send("Invalid Dish ID");

		const userId = req.user._id;
		const dish = await Dish.findById(dishId);
		const basket = await Basket.findOne({ userId });

		if (!basket) {
			const userBasket: IBasket = new Basket({ dishes: [dishId], userId });
			await userBasket.save();

			return res.json({ message: "Dish added to new basket successfully", dish });
		}

		const userBasket = await Basket.findOne({ userId, dishes: dishId });
		if (userBasket) return res.json({ message: "This dish is already in basket" });

		await Basket.findByIdAndUpdate(basket, { $push: { dishes: dishId } });

		return res.json({ message: "Dish added to basket successfully", dish });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const removeFromBasket: RequestHandler = async (req, res) => {
	try {
		const { dishId }: { dishId?: string } = req.params;
		if (!isValidObjectId(dishId)) return res.status(400).send("Invalid Dish ID");

		const userId = req.user._id;
		await Basket.findOneAndUpdate({ userId, $pull: { dishes: dishId } });

		return res.json({ message: "Dish removed from basket successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const getBasketRestaurant: RequestHandler = async (req, res) => {
	try {
		if (req.user.role !== roleEnum.CUSTOMER) return res.status(400).send("Invalid User Role");

		const userId = req.user._id;

		const basket = await Baskets.aggregate([
			{
				$match: {
					userId: { $eq: new mongoose.Types.ObjectId(userId) },
				},
			},
			{
				$lookup: {
					from: "dishes",
					localField: "dishes",
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
					"restaurant._id": 1,
					"restaurant.name": 1,
					"restaurant.address": 1,
				},
			},
		]);

		return res.json({ message: "Basket dishes of user", basket: basket[0] });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const getBasketDishes: RequestHandler = async (req, res) => {
	try {
		if (req.user.role !== roleEnum.CUSTOMER) return res.status(400).send("Invalid User Role");

		const userId = req.user._id;
		const { restaurantId }: { restaurantId?: string } = req.params;
		if (!restaurantId || !isValidObjectId(restaurantId))
			return res.status(400).send("Invalid Restaurant ID");

		const dish = await Baskets.aggregate([
			{
				$match: {
					userId: new mongoose.Types.ObjectId(userId),
				},
			},
			{
				$lookup: {
					from: "dishes",
					localField: "dishes",
					foreignField: "_id",
					as: "dish",
				},
			},
			{
				$unwind: "$dish",
			},
			{
				$match: {
					"dish.restaurant": new mongoose.Types.ObjectId(restaurantId),
				},
			},
			{
				$project: {
					"restaurant._id": 1,
					dish: 1,
				},
			},
		]);

		return res.json({ message: "Basket dishes of specified restaurant of user", dish });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};
