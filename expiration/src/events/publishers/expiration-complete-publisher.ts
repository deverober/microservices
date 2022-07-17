import {
	Subjects,
	Publisher,
	ExpirationCompleteEvent,
} from "@deverober/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
