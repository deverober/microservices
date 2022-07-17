import { Publisher, Subjects, TicketUpdatedEvent } from "@deverober/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
