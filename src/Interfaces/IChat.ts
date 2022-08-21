import mongoose from "mongoose";

export interface IChat extends mongoose.Document {
  senderId: mongoose.Schema.Types.ObjectId;
  receiverId: mongoose.Schema.Types.ObjectId;
  body: string;
}
