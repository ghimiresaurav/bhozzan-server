import { Schema, model } from "mongoose";
import { IOrders } from "../Interfaces/IOrder";
const { ObjectId } = Schema.Types;

const ordersSchema = new Schema<IOrders>({
  userId: {
    type: ObjectId,
    required: true,
  },
  dishes: {
    // type: [IOrder],
    required: true,
  },
});

const Orders = model<IOrders>("Orders", ordersSchema);
export default Orders;
