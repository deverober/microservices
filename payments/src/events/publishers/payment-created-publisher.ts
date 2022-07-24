import { Publisher, Subjects, PaymentCreatedEvent } from "@deverober/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
