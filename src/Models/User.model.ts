import { Schema, model } from "mongoose";
import { roleEnum } from "../enums/roleEnum";
import { IUser } from "../Interfaces/IUser";

const userSchema = new Schema<IUser>(
  {
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    middleName: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    role: {
      type: String,
      default: roleEnum.CUSTOMER,
      enum: roleEnum,
      // enum: [roleEnum.CUSTOMER, roleEnum.MANAGER, roleEnum.ADMIN],
      required: true,
    },
    address: {
      type: String,
      required: true,
      maxlength: 40,
      trim: true,
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    revokedRewardPoints: {
      type: Number,
      default: 0,
    },
    debt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);
export default User;
