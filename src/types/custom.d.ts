import { IUser } from "../Interfaces/IUser";

declare namespace Express {
	interface Request {
		user: IUser;
	}
}
