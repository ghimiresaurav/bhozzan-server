import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { roleEnum, rolePowerEnum } from "../enums/roleEnum";
import { IUser } from "../Interfaces/IUser";
import User from "../Models/User.model";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "") as string;
		const data: any = jwt.verify(token, process.env.JWT_SECRET as string);
		const user = await User.findById(data.id);

		if (!user) throw new Error();

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ error: "Unauthorized!" });
	}
};

export const isManager = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { role }: IUser = req.user;
		if (rolePowerEnum[role] > rolePowerEnum[roleEnum.CUSTOMER]) return next();
		throw new Error();
	} catch (error) {
		return res.status(401).json({ error: "Not enough permission" });
	}
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { role }: IUser = req.user;
		if (rolePowerEnum[role] > rolePowerEnum[roleEnum.MANAGER]) return next();
		throw new Error();
	} catch (error) {
		return res.status(401).json({ error: "Not enough permission" });
	}
};
