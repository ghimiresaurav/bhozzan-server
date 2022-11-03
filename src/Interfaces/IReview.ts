import mongoose from "mongoose";

export interface IReview extends mongoose.Document {
	userId: mongoose.Schema.Types.ObjectId;
	body?: string;
	rating: number;
}
