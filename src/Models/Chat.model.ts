import { Schema, model } from "mongoose";
import { IChat } from "../Interfaces/IChat";
const { ObjectId } = Schema.Types;

const chatSchema = new Schema<IChat>({
  senderId: {
    type: ObjectId,
    required: true,
  },
  receiverId: {
    type: ObjectId,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

const Chat = model<IChat>("Chat", chatSchema);
export default Chat;
