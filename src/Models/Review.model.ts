import { Schema, model } from "mongoose";
import { IReview } from "../Interfaces/IReview";
const { ObjectId } = Schema.Types;

const reviewSchema = new Schema<IReview>(
	{
		userId: {
			type: ObjectId,
			required: true,
		},
		body: {
			type: String,
			minlength: 5,
		},
		rating: {
			type: Number,
			minlength: 5,
		},
	},
	{ timestamps: true }
);

const Review = model<IReview>("Review", reviewSchema);
export default Review;
