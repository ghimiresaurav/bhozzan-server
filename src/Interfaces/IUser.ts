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
}

export interface IUser
  extends IUserDTO,
    IUserRegistrationDTO,
    mongoose.Document {
  rewardPoints: number;
  revokedRewardPoints: number;
  debt: number;
}
