import { Schema, model } from "mongoose";
import { ITable } from "../Interfaces/ITable";
const { ObjectId } = Schema.Types;

const tableSchema = new Schema<ITable>({
  restaurantId: {
    type: ObjectId,
    required: true,
  },
  reservedBy: {
    type: ObjectId,
    required: true,
  },
  isReserved: {
    type: Boolean,
    required: true,
  },
  reservedUntil: {
    type: Date,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
});

const Table = model<ITable>("Table", tableSchema);
export default Table;
