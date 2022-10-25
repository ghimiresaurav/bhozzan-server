import mongoose, { Schema, model } from "mongoose";
import { IBasket } from "../Interfaces/IBasket";
const { ObjectId } = Schema.Types;

const basketSchema = new Schema<IBasket>({
	userId: {
		type: ObjectId,
		required: true,
		ref: "User",
	},
	dishes: {
		type: [ObjectId],
		required: true,
		ref: "Dish",
	},
});

const Baskets = model<IBasket>("Basket", basketSchema);
export default Baskets;
