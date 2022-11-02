import { Socket } from "socket.io";

export const socketServer = (socket: Socket) => {
	socket.on("join", (id: any) => {
		console.log(id);
	});
};
