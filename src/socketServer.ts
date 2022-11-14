import { Socket } from "socket.io";
import { Types } from "mongoose";

export const socketServer = (socket: Socket) => {
	socket.on("join", (id: string) => {
		socket.join(id);
	});
	socket.on("join-room", (room: string) => {
		socket.join(room);
	});
	socket.on("new-message", (data: any) => {
		const xxdata = { ...data, time: Date(), _id: new Types.ObjectId() };
		socket.broadcast.to(data.room).emit("message-received", xxdata);
	});
};
