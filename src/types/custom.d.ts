declare namespace Express {
	interface Request {
		user: import("../Interfaces/IUser").IUser;
	}
}
