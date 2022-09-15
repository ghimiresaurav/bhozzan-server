import mongoose from "mongoose";

export interface IRestaurantDTO {
	name: string;
	address: string;
	PAN: number;
	primaryPhoneNumber: number;
	phoneNumbers?: Array<number>;
}
export interface IRestaurant extends IRestaurantDTO, mongoose.Document {
	dishes: Array<mongoose.Schema.Types.ObjectId | string>;
	rating: number;
	tables: Array<mongoose.Schema.Types.ObjectId | string>;
	isVerified: boolean;
	noOfShippers: number;
}
