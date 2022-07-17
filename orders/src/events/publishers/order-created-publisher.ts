import { Publisher, OrderCreatedEvent, Subjects } from "@deverober/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
