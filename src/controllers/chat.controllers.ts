import { RequestHandler } from "express";
import { roleEnum } from "../enums/roleEnum";
import { IChatRoom } from "../Interfaces/IChat-Room";
import { IUser } from "../Interfaces/IUser";
import ChatRoom from "../Models/Chat-Room.model";
import User from "../Models/User.model";
import errorHandlers from "../utils/error-handlers";

export const createRoom: RequestHandler = async (req, res) => {
	try {
		// Only customers can start chat
		if (req.user.role !== roleEnum.CUSTOMER)
			return res.status(401).json({ message: "Invalid User Role" });

		const { restaurantId }: { restaurantId?: string } = req.params;

		// Find the manager of the restaurant
		const manager: IUser | null = await User.findOne({
			restaurant: restaurantId,
			role: roleEnum.MANAGER,
		}).select("_id");
		if (!manager) return res.status(400).json({ message: "Manager not found" });

		const existingChatRoom = await ChatRoom.findOne({ users: [manager._id, req.user._id] });
		if (existingChatRoom) return res.json({ message: "Chatroom exists", existingChatRoom });

		const chatroom: IChatRoom = new ChatRoom({ name: "Chat", users: [manager._id, req.user._id] });
		await chatroom.save();

		return res.json({ message: "New chat room created.", chatroom });
	} catch (error) {
		console.error(error);
		res.status(500).send(errorHandlers(error));
	}
};
