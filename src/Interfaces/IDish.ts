import mongoose from "mongoose";

export interface IDishDTO {
	name: string;
	category: string;
	price: number;
}
export interface IDish extends IDishDTO, mongoose.Document {
	restaurant: mongoose.Schema.Types.ObjectId;
}
