import { Request, Response, NextFunction } from "express";
import { roleEnum } from "../enums/roleEnum";
import Restaurant from "../Models/Restaurant.model";
import errorHandlers from "../utils/error-handlers";

export const isVerified = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Skip if the request method is GET or DELETE
		// Or the user is admin
		if (req.method === "GET" || req.method === "DELETE" || req.user.role === roleEnum.ADMIN)
			return next();

		const restaurant = await Restaurant.findById(req.user.restaurant).select("isVerified");

		// Check whether the restaurant is verified or not
		if (!restaurant?.isVerified) throw new Error("Unverified restaurant.");

		next();
	} catch (error) {
		console.error(error);
		return res.status(401).json({ error: errorHandlers(error) });
	}
};
