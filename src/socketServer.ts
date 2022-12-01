import { Types } from "mongoose";
import { Server as SocketServer, Socket } from "socket.io";
import { Server } from "http";
import { IOrderNotification } from "./Interfaces/IOrderNotification";

let io: SocketServer, globalSocket: Socket;
export const socketConnection = (httpServer: Server) => {
	// Create instance of socket server
	io = new SocketServer(httpServer, {
		cors: { origin: "*" },
	});
	io.on("connection", (socket: Socket) => {
		globalSocket = socket;
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
	});
};

// Send notification to users in the room on events
export const sendNotification = (room: string, notification: IOrderNotification) => {
	globalSocket.in(room).emit("notification", notification);
};
