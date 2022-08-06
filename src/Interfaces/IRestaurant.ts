import mongoose from "mongoose";

export interface IRestaurant {
  managerId: mongoose.Schema.Types.ObjectId;
  name: string;
  foodList: Array<mongoose.Schema.Types.ObjectId | string>;
  address: string;
  rating: number;
  tables: Array<mongoose.Schema.Types.ObjectId | string>;
  isVerified: boolean;
  PAN: number;
  phoneNumbers: Array<number>;
}
