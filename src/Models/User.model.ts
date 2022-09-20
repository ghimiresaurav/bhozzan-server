import { Schema, model, Model } from "mongoose";
import { roleEnum } from "../enums/roleEnum";
import { IUser } from "../Interfaces/IUser";
import bcrypt from "bcrypt";
const { ObjectId } = Schema.Types;

interface IUserModel extends Model<IUser> {
	findByCredentials: (phoneNumber: number, password: string) => Promise<IUser | null>;
}

const userSchema = new Schema<IUser>(
	{
		phoneNumber: {
			type: Number,
			required: true,
			unique: true,
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
		restaurant: {
			type: ObjectId,
			ref: "Restaurant",
		},
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (this, next) {
	// Make sure the primary phone number is not used by any user
	const userWithSamePhoneNumber: IUser | null = await User.findOne({
		phoneNumber: this.phoneNumber,
	});

	if (userWithSamePhoneNumber) {
		const error: Error = new Error("Phone number is already in use");
		next(error);
	}
	next();
});

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
	try {
		// Find the user by phone number
		const user: IUser | null = await User.findOne({ phoneNumber });
		if (!user) throw new Error("User does not exist");

		// Check if password matches
		const passwordMatches: boolean = await bcrypt.compare(password, user.password);
		if (!passwordMatches) throw new Error("Invalid Credentials");

		return user;
	} catch (error) {
		console.error(error);
		return null;
	}
};

const User = model<IUser, IUserModel>("User", userSchema);
export default User;
