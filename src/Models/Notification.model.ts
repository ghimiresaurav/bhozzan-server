import { Schema, model } from "mongoose";
import { INotification } from "../Interfaces/INotification";
const { ObjectId } = Schema.Types;

const notificationSchema = new Schema<INotification>({
  userId: {
    type: ObjectId,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Notification = model<INotification>("Notification", notificationSchema);
export default Notification;
