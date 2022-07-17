import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns 404 if provided id does not exist", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.set("Cookie", global.signup())
		.send({
			title: "new ticket",
			price: 20,
		})
		.expect(404);
});

it("returns 401 if user is not authenticated", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();

	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: "new ticket",
			price: 20,
		})
		.expect(401);
});

it("returns 401 if user does not own a ticket", async () => {
	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", global.signup())
		.send({
			title: "asdf",
			price: 30,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", global.signup())
		.send({
			title: "jkl;",
			price: 100,
		})
		.expect(401);
});

it("returns 400 if user provides invalid title or price", async () => {
	const cookie = global.signup();

	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "asdf",
			price: 30,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "",
			price: 30,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "jkl;",
			price: -30,
		})
		.expect(400);
});

it("updates the ticket provided valid inputs", async () => {
	const cookie = global.signup();

	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "asdf",
			price: 30,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 100,
		})
		.expect(200);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send();

	expect(ticketResponse.body.title).toEqual("new title");
	expect(ticketResponse.body.price).toEqual(100);
});

it("publishes an event", async () => {
	const cookie = global.signup();

	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "asdf",
			price: 30,
		});

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 100,
		})
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
	const cookie = global.signup();

	const response = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({
			title: "asdf",
			price: 30,
		});

	const ticket = await Ticket.findById(response.body.id);
	ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

	await ticket!.save();

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "new title",
			price: 100,
		})
		.expect(400);
});
