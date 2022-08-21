import { Schema, model } from "mongoose";
import { ITodays } from "../Interfaces/ITodays";
const { ObjectId } = Schema.Types;

const todaysSchema = new Schema<ITodays>({
  dishId: {
    type: ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const Today = model<ITodays>("Todays", todaysSchema);
export default Today;
