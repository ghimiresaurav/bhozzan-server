import mongoose, { Schema, model } from "mongoose";
import { IBasket } from "../Interfaces/IBasket";
const { ObjectId } = Schema.Types;

const basketSchema = new Schema<IBasket>({
	userId: {
		type: ObjectId,
		required: true,
	},
	dishes: {
		type: [ObjectId],
		required: true,
	},
});

const Baskets = model<IBasket>("Basket", basketSchema);
export default Baskets;
