import { Schema, model } from "mongoose";
import { IRestaurant } from "../Interfaces/IRestaurant";
const { ObjectId } = Schema.Types;

const restaurantSchema = new Schema<IRestaurant>({
  managerId: {
    type: ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  foodList: {
    type: [ObjectId],
    default: [],
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
  phoneNumbers: {
    type: [Number],
    required: true,
  },
});

const Restaurant = model<IRestaurant>("Restaurant", restaurantSchema);
export default Restaurant;
