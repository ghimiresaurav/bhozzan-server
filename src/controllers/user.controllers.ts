import { RequestHandler } from "express";
import User from "../Models/User.model";
import { IUser, IUserDTO, IUserRegistrationDTO } from "../Interfaces/IUser";
// import Orders from "../Models/Order.model";
// // import { IOrder } from "../Interfaces/IOrder";
import Restaurant from "../Models/Restaurant.model";
import jwt from "jsonwebtoken";
import errorHandlers from "../utils/error-handlers";
import isValidObjectId from "../utils/isValidObjectId";
import { ObjectId } from "mongoose";
import { IRestaurant } from "../Interfaces/IRestaurant";

export const registerUser: RequestHandler = async (req, res) => {
	try {
		// Extract user input from request
		const userData: IUserRegistrationDTO = req.body;

		// Create an instance of User
		const user: IUser = new User(userData);

		// Save the user to the database
		await user.save();

		// Send a success message
		return res.json({
			message: "User Registration Complete :)",
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const handleLogin: RequestHandler = async (req, res) => {
	try {
		// Extract user inputs
		const { phoneNumber, password }: IUserDTO = req.body;

		// Find if the user exists
		const user = await User.findByCredentials(phoneNumber, password);

		//If the user does not exist, send an error message
		if (!user)
			return res.status(401).json({
				error: "Invalid login credentials",
			});

		// If everything is okay, sign a token with the user's information
		const token = jwt.sign(
			{
				phoneNumber: user.phoneNumber,
				id: user._id,
			},
			<string>process.env.JWT_SECRET,
			{ expiresIn: "7d" }
		);

		// Return a success message with the token and other useful information
		return res.json({
			token,
			id: user._id,
			role: user.role,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

// export const order: RequestHandler = async (req, res) => {
// 	try {
// 		const userId = req.user.id;
// 		const order: IOrders | null = await Orders.findOne({ userId });

// 		// Create new entry if first time order
// 		if (!order) {
// 			const order: IOrders = new Orders({ userId, dishes: req.body });
// 			await order.save();
// 		}

// 		// Else update existing entry
// 		await Orders.findOneAndUpdate(userId, {
// 			$push: { dishes: req.body },
// 		});

// 		return res.json({ message: "New Order Added Successfully" });
// 	} catch (error) {
// 		console.error(error);
// 		return res.status(500).send(errorHandlers(error));
// 	}
// };

export const favoriteRestaurant: RequestHandler = async (req, res) => {
	try {
		const userId = req.user._id;
		const { restaurantId }: { restaurantId?: string } = req.params;
		if (!isValidObjectId(restaurantId)) return res.status(400).send("Invalid Restaurant ID");

		const user = await User.findOne({ _id: userId, favorites: restaurantId });
		if (user) return res.json({ message: "The restaurant is already your favorite" });

		await User.findByIdAndUpdate(userId, { $push: { favorites: restaurantId } });

		return res.json({ message: "Restaurant Favorited Sucessfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const removeFromFavorite: RequestHandler = async (req, res) => {
	try {
		const userId = req.user._id;
		const { restaurantId }: { restaurantId?: string } = req.params;
		if (!isValidObjectId(restaurantId)) return res.status(400).send("Invalid Restaurant ID");

		const user = await User.findOne({ _id: userId, favorites: restaurantId });
		if (!user) return res.json({ message: "The restaurant is already your favorite" });

		await User.findByIdAndUpdate(userId, { $push: { favorites: restaurantId } });

		return res.json({ message: "Restaurant Favorited Sucessfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const myFavorites: RequestHandler = async (req, res) => {
	try {
		const userId = req.user._id;
		const favoritedIds = await User.findById(userId, { favorites: 1 });

		if (!favoritedIds) return res.json({ message: "No favorite restaurant" });

		const favoriteRestaurants = await Restaurant.find(
			{ _id: { $in: favoritedIds.favorites } },
			{ name: 1, address: 1 }
		);
		return res.json({ favoriteRestaurants, message: "Favorite Restaurants Showed Sucessfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const getMyDetails: RequestHandler = async (req, res) => {
	try {
		const user = req.user;
		if (!user) return res.status(400).send("Login to see your details");
		return res.json({ user });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};
