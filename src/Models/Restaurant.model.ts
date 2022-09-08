import { Schema, model } from "mongoose";
import { roleEnum } from "../enums/roleEnum";
import { IRestaurant } from "../Interfaces/IRestaurant";
import { IUser, IUserRegistrationDTO } from "../Interfaces/IUser";
import getAbbreviatedName from "../utils/get-abbreviated-name";
import User from "./User.model";
const { ObjectId } = Schema.Types;

const restaurantSchema = new Schema<IRestaurant>({
	name: {
		type: String,
		required: true,
		maxlength: 50,
		trim: true,
	},
	dishes: {
		type: [ObjectId],
		default: [],
		ref: "Dish",
	},
	address: {
		type: String,
		required: true,
		maxlength: 60,
	},
	rating: {
		type: Number,
		default: 0,
	},
	tables: {
		type: [ObjectId],
		default: [],
		ref: "Table",
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	PAN: {
		type: Number,
		required: true,
		unique: true,
	},
	primaryPhoneNumber: {
		type: Number,
		required: true,
	},
	phoneNumbers: {
		type: [Number],
	},
});

// Validate
restaurantSchema.pre("save", async function (this, next) {
	// Make sure the PAN is unique
	const restaurantWithSamePan: IRestaurant | null = await Restaurant.findOne({
		PAN: this.PAN,
	});

	if (restaurantWithSamePan) {
		const error: Error = new Error("The PAN is already in use");
		next(error);
	}

	const userWithSamePhoneNumber: IUser | null = await User.findOne({
		phoneNumber: this.primaryPhoneNumber,
	});

	if (userWithSamePhoneNumber) {
		const error: Error = new Error("The Primary phone number is already in use");
		next(error);
	}
	next();
});

restaurantSchema.post("save", async function (doc, next) {
	try {
		// Create abbreviation of the name of the restaurant
		const abbreviatedRestaurantName = getAbbreviatedName(doc.name);

		const managerData: IUserRegistrationDTO = {
			firstName: abbreviatedRestaurantName,
			lastName: "Manager",
			phoneNumber: doc.primaryPhoneNumber,
			password: `m@${abbreviatedRestaurantName}`,
			role: roleEnum.MANAGER,
			address: doc.address,
			restaurant: doc._id,
		};

		const manager: IUser = new User(managerData);
		await manager.save();
		next();
	} catch (error: any) {
		console.error(error);
		next(error);
	}
});

const Restaurant = model<IRestaurant>("Restaurant", restaurantSchema);
export default Restaurant;
