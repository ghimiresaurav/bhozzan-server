import { RequestHandler } from "express";
import User from "../Models/User.model";
import { IUser, IUserDTO, IUserRegistrationDTO } from "../Interfaces/IUser";
import Restaurant from "../Models/Restaurant.model";
import jwt from "jsonwebtoken";
import errorHandlers from "../utils/error-handlers";
import isValidObjectId from "../utils/isValidObjectId";

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
			{ expiresIn: "7h" }
		);

		const refreshToken = jwt.sign(
			{
				phoneNumber: user.phoneNumber,
				id: user._id,
			},
			<string>process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "7d" }
		);

		// Return a success message with the token and other useful information
		return res.json({
			token,
			refreshToken,
			id: user._id,
			role: user.role,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const refreshToken: RequestHandler = async (req, res) => {
	try {
		const refreshToken = req.header("Authorization")?.replace("Bearer ", "") as string;
		const data: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
		const user = await User.findById(data.id);

		if (!user) throw new Error();

		const token = jwt.sign(
			{
				phoneNumber: user.phoneNumber,
				id: user._id,
			},
			<string>process.env.JWT_SECRET,
			{ expiresIn: "7h" }
		);

		const newRefreshToken = jwt.sign(
			{
				phoneNumber: user.phoneNumber,
				id: user._id,
			},
			<string>process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "7d" }
		);

		return res.json({ message: "Token Successfully Refreshed", token, newRefreshToken });
	} catch (error) {
		return res.status(401).json({ error: "Unauthorized!" });
	}
};

export const favoriteRestaurant: RequestHandler = async (req, res) => {
	try {
		const userId = req.user._id;
		const { restaurantId }: { restaurantId?: string } = req.params;
		if (!isValidObjectId(restaurantId)) return res.status(400).send("Invalid Restaurant ID");

		const user = await User.findOne({ _id: userId, favorites: restaurantId });
		if (user) return res.status(403).json({ error: "The restaurant is already your favorite" });

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
		if (!user) return res.status(403).json({ error: "The restaurant is not a favorite" });

		await User.findByIdAndUpdate(userId, { $pull: { favorites: restaurantId } });

		return res.json({ message: "Restaurant Unfavorited Sucessfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};

export const myFavorites: RequestHandler = async (req, res) => {
	try {
		const userId = req.user._id;
		const favoritedIds = await User.findById(userId, { favorites: 1 });
		if (!favoritedIds) return res.status(400).json({ message: "Favorites not found" });

		if (!favoritedIds.favorites.length) return res.json({ message: "No favorite restaurants" });

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
