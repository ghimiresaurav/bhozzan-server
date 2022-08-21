import mongoose from "mongoose";

export interface ITodays extends mongoose.Document {
  dishId: mongoose.Schema.Types.ObjectId;
  quantity: number;
}
