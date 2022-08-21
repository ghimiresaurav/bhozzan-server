import mongoose from "mongoose";

export interface IDish extends mongoose.Document {
  restaurantId: mongoose.Schema.Types.ObjectId;
  name: string;
  category: string;
  price: number;
  imageLink: string;
}
