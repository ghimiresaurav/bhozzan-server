import mongoose from "mongoose";
import { roleEnum } from "../enums/roleEnum";

export interface IUserDTO {
	phoneNumber: number;
	password: string;
}

export interface IUserRegistrationDTO extends IUserDTO {
	firstName: string;
	middleName?: string;
	lastName: string;
	address: string;
	role: roleEnum;
	restaurant?: mongoose.Schema.Types.ObjectId;
}

export interface IUser extends IUserRegistrationDTO, mongoose.Document {
	rewardPoints: number;
	revokedRewardPoints: number;
	debt: number;
}
