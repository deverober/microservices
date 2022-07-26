import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(201);
});

it("should return 400 on invalid email", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: "testtest.com",
			password: "password",
		})
		.expect(400);
});

it("should return 400 on invalid password", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: "testtest.com",
			password: "p",
		})
		.expect(400);
});

it("should return 400 on no password or email", async () => {
	return request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(201);

	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(400);
});

it("sets a cookie after sucessful signup", async () => {
	const response = await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(201);

	expect(response.get("Set-Cookie")).toBeDefined();
});
