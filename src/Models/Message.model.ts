import { Schema, model } from "mongoose";
import { IMessage } from "../Interfaces/IMessage";
const { ObjectId } = Schema.Types;

const messageSchema = new Schema<IMessage>(
	{
		sender: {
			type: ObjectId,
			required: true,
			ref: "User",
			immutable: true,
		},
		body: {
			type: String,
			required: true,
			trim: true,
			maxlength: 1000,
		},
		room: {
			type: ObjectId,
			required: true,
			ref: "ChatRoom",
			immutable: true,
		},
	},
	{ timestamps: true }
);

const Message = model<IMessage>("Message", messageSchema);
export default Message;
