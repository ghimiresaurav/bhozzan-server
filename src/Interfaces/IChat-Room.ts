import mongoose from "mongoose";

export interface IChatRoom extends mongoose.Document {
	name: string;
	users: Array<mongoose.Schema.Types.ObjectId | string>;
	latestMessage?: mongoose.Schema.Types.ObjectId | string;
}
