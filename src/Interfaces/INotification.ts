import mongoose from "mongoose";

export interface INotification extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  message: string;
}
