import app from "../src/App";
import request from "supertest";
import { db } from "../src/db";
import * as bcrypt from "bcrypt";

afterAll(() => {
	db.end();
});

describe("Logging in", () => {
	test("With a valid login should return 200", async () => {
		console.log("FUCCKCKCKCKC", bcrypt.hashSync("test", 10));
		const response = await request(app).post("/api/user/login").send({
			username: "test",
			password: "test"
		});
		expect(response.statusCode).toEqual(200);
	});

	test("With an invalid login should return 401", async () => {
		const response = await request(app).post("/api/user/login").send({
			username: "test",
			password: "invalid_password"
		});
		expect(response.statusCode).toEqual(401);
	});
});