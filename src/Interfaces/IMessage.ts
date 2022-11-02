import mongoose from "mongoose";

export interface IMessage extends mongoose.Document {
	sender: mongoose.Schema.Types.ObjectId | string;
	body: string;
	room: mongoose.Schema.Types.ObjectId | string;
}
