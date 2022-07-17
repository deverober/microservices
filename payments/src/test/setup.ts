import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
	var signup: (id?: string) => string[];
	var createMongoId: () => string;
}

jest.mock("../nats-wrapper.ts");

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = "test-key-1234";
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri);
});

beforeEach(async () => {
	jest.clearAllMocks();
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

global.signup = (id?: string) => {
	// Build a JWT Payload. { id, email }
	const payload = {
		id: id || new mongoose.Types.ObjectId().toHexString(),
		email: "test@test.com",
	};
	// create the JWT
	const token = jwt.sign(payload, process.env.JWT_KEY!);
	// Build session object { jwt: MY_JWT }
	const session = { jwt: token };
	// Turn that session into JSON
	const sessionJSON = JSON.stringify(session);
	// Take JSON and encode it as base64
	const base64 = Buffer.from(sessionJSON).toString("base64");
	// return a string thats the cookie with the encoded data
	return [`session=${base64}`];
};

global.createMongoId = () => {
	return new mongoose.Types.ObjectId().toHexString();
};
