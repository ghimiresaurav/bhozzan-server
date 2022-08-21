import { Schema, model } from "mongoose";
import { roleEnum } from "../enums/roleEnum";
import { IUser } from "../Interfaces/IUser";
import bcrypt from "bcrypt";

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

// Middlewares
userSchema.pre("save", async function (next) {
  // Hash the user's password before saving the user to the database
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Model methods
userSchema.statics.findByCredentials = async (
  phoneNumber: number,
  password: string
): Promise<IUser | null> => {
  // Search for a user by their phone number and password
  try {
    // Find the user
    const user: IUser | null = await User.findOne({ phoneNumber });
    if (!user) throw new Error("User not found");

    // Check if the password matches
    const passwordMatches: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) throw new Error("Phone number or password incorrect");
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const User = model<IUser>("User", userSchema);
export default User;
