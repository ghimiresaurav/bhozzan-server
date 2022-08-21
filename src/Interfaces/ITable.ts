import mongoose from "mongoose";

export interface ITable extends mongoose.Document {
  restaurantId: mongoose.Schema.Types.ObjectId;
  reservedBy: mongoose.Schema.Types.ObjectId;
  isReserved: boolean;
  reservedUntil: Date;
  seats: number;
  position: string;
  rate: number;
}
