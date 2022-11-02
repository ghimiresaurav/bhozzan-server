import { Schema, model } from "mongoose";
import { IChatRoom } from "../Interfaces/IChat-Room";
const { ObjectId } = Schema.Types;

const chatRoomSchema = new Schema<IChatRoom>(
	{
		name: {
			type: String,
		},
		users: [
			{
				type: ObjectId,
				required: true,
				ref: "User",
			},
		],
		latestMessage: {
			type: ObjectId,
			ref: "Message",
		},
	},
	{ timestamps: true }
);

const ChatRoom = model<IChatRoom>("ChatRoom", chatRoomSchema);
export default ChatRoom;
