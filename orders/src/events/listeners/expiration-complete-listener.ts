import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import {
	Listener,
	Subjects,
	ExpirationCompleteEvent,
	OrderStatus,
} from "@deverober/common";
import { Message } from "node-nats-streaming";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
	queueGroupName: string = queueGroupName;

	async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
		const order = await Order.findById(data.orderId).populate("ticket");

		if (!order) {
			throw new Error("Order not found");
		}

		order.set({
			status: OrderStatus.Cancelled,
		});

		await order.save();

		await new OrderCancelledPublisher(this.client).publish({
			id: order.id,
			ticket: {
				id: order.ticket.id,
			},
			version: order.version,
		});

		msg.ack();
	}
}
