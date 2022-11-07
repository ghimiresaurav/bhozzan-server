import { RequestHandler } from "express";
import { IReview } from "../Interfaces/IReview";
import Restaurant from "../Models/Restaurant.model";
import errorHandlers from "../utils/error-handlers";
import isValidObjectId from "../utils/isValidObjectId";

export const addReview: RequestHandler = async (req, res) => {
	try {
		const userId = req.user._id;
		const { restaurant }: { restaurant?: string } = req.params;
		if (!isValidObjectId(restaurant)) return res.status(400).send("Invalid Restaurant ID");

		const userReview: IReview = { userId, ...req.body };
		const reviewExist = await Restaurant.find({ _id: restaurant, "reviews.userId": userId });

		if (reviewExist.length) {
			await Restaurant.findOneAndUpdate(
				{ _id: restaurant, "reviews.userId": userId },
				{ $set: { "reviews.$.rating": userReview.rating, "reviews.$.body": userReview.body } }
			);
			return res.json({ message: "Review Updated Succesfully" });
		}

		await Restaurant.findByIdAndUpdate(restaurant, { $push: { reviews: userReview } });

		return res.json({ message: "Review Added Succesfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).send(errorHandlers(error));
	}
};
