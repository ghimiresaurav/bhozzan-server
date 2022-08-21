import mongoose from "mongoose";

export interface IBaskets extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  dishes: Array<mongoose.Schema.Types.ObjectId | string>;
}
