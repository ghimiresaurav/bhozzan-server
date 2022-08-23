import { RequestHandler } from "express";
import User from "../Models/User.model";
import { IUser, IUserDTO, IUserRegistrationDTO } from "../Interfaces/IUser";
import jwt from "jsonwebtoken";

export const registerUser: RequestHandler = async (req, res) => {
	try {
		// Extract user input from request
		const userData: IUserRegistrationDTO = req.body;

		// Check whether the email is already registered or not
		const userExists: IUser | null = await User.findOne({ phoneNumber: userData.phoneNumber });

		if (userExists) return res.status(409).json({ message: "The phone number is already in use." });

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
		return res.status(500).send(error);
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
		});
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};
