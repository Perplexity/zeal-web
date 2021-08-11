import app from "../src/App";
import request from "supertest";
import { db } from "../src/db";

afterAll(() => {
	db.end();
});

describe("/api/user/login", () => {
	test("With a valid login should return 200 with a token", async () => {
		const response = await request(app).post("/api/user/login").send({
			username: "test",
			password: "test"
		});
		expect(response.statusCode).toEqual(200);
		expect(response.body.token).toBeTruthy();
	});

	test("With an invalid login should return 401", async () => {
		const response = await request(app).post("/api/user/login").send({
			username: "test",
			password: "invalid_password"
		});
		expect(response.statusCode).toEqual(401);
	});
});