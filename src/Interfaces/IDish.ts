import mongoose from "mongoose";

export interface IDishDTO {
	name: string;
	category: string;
	price: number;
	imageLink: string;
}
export interface IDish extends IDishDTO, mongoose.Document {
	restaurantId: mongoose.Schema.Types.ObjectId;
}
