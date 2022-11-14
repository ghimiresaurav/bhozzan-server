import { RequestHandler } from "express";
import ChatRoom from "../Models/Chat-Room.model";
import Message from "../Models/Message.model";
import errorHandlers from "../utils/error-handlers";
import isValidObjectId from "../utils/isValidObjectId";

export const createNewMessage: RequestHandler = async (req, res) => {
	try {
		const { body, roomId }: { body?: string; roomId?: string } = req.body;
		if (!roomId || !isValidObjectId(roomId))
			return res.status(400).json({ message: "Invalid chat id" });

		if (!body) return res.status(400).json({ message: "Message cannot be empty" });

		// Create message
		const message = new Message({ body, sender: req.user._id, room: roomId });

		// Make sure the user is in the room
		const chat = await ChatRoom.findOneAndUpdate(
			{ _id: roomId, users: req.user._id },
			// Update latestMessage
			{ $set: { latestMessage: message._id } }
		);
		if (!chat) return res.status(404).json({ message: "Chat room not found" });

		// Finally save the message to database
		await message.save();
		return res.json({ message: "Message saved", text: message });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: errorHandlers(error) });
	}
};

export const getMessages: RequestHandler = async (req, res) => {
	try {
		const { chatId }: { chatId?: string } = req.params;
		if (!chatId || !isValidObjectId(chatId))
			return res.status(400).json({ message: "Invalid chat room id" });

		const chat = await ChatRoom.findOne({ _id: chatId, users: req.user._id });
		if (!chat) return res.status(404).json({ message: "Chat room not found" });

		const messages = await Message.find({ room: chatId }).limit(10);
		if (!messages) return res.status(404).json({ message: "Messages not found" });

		return res.json({ message: "Message of requested room", messages });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: errorHandlers(error) });
	}
};
