import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";
console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
	url: "http://localhost:4222",
});

// @ts-ignore
stan.on("connect", () => {
	console.log("Listening connected to nats");
	// @ts-ignore
	stan.on("close", () => {
		console.log("NATS connection closed!");
		// @ts-ignore
		process.exit();
	});

	new TicketCreatedListener(stan).listen();
});
// @ts-ignore
process.on("SIGINT", () => stan.close());
// @ts-ignore
process.on("SIGTERM", () => stan.close());
