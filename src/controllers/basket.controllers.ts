import { RequestHandler } from "express";
import { IBasket } from "../Interfaces/IBasket";
import Basket from "../Models/Basket.model";
import errorHandlers from "../utils/error-handlers";
import isValidObjectId from "../utils/isValidObjectId";

export const addToBasket: RequestHandler = async (req, res) => {
	try {
		const { dishId }: { dishId?: string } = req.params;
		if (!isValidObjectId(dishId)) return res.status(400).send("Invalid Dish ID");

		const userId = req.user._id;
		if (!userId) return res.status(400).send("User not found");

		const basket = await Basket.findOne({ userId });

		if (!basket) {
			const userBasket: IBasket = new Basket({
				dishes: [dishId],
				userId,
			});
			await userBasket.save();
			return res.json({ message: "Dish added to new basket successfully" });
		}

		const userBasket = await Basket.findOne({ userId, dishes: dishId });
		if (userBasket) return res.json({ message: "This dish is already in basket" });

		await Basket.findByIdAndUpdate(basket, { $push: { dishes: dishId } });

		return res.json({ message: "Dish added to basket successfully" });
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
		if (!userId) return res.status(400).send("User not found");

		await Basket.findOneAndUpdate({ userId, $pull: { dishes: dishId } });

		return res.json({ message: "Dish removed from basket successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const getBasketDishes: RequestHandler = async (req, res) => {
	try {
		const userId = req.user._id;
		if (!userId) return res.status(400).send("User not found");

		const basket = await Basket.find({ userId });

		return res.json({ message: "Basket dishes of user", basket });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};
