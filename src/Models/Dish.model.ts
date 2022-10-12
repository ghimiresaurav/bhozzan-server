import { Schema, model } from "mongoose";
import { IDish } from "../Interfaces/IDish";
const { ObjectId } = Schema.Types;

const dishSchema = new Schema<IDish>({
	restaurant: {
		type: ObjectId,
		required: true,
	},
	name: {
		type: String,
		required: true,
		maxLength: 60,
	},
	category: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	imageLink: {
		type: String,
		required: true,
	},
});

const Dish = model<IDish>("Dish", dishSchema);
export default Dish;
