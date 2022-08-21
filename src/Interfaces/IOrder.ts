import mongoose from "mongoose";

interface IOrder {
  dishId: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

export interface IOrders extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  dishes: [IOrder];
}
