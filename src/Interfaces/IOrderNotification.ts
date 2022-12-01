import { IOrder } from "./IOrder";

export interface IOrderNotification {
	message: string;
	order: IOrder;
}
