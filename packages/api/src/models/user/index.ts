import { OkPacket, RowDataPacket } from "mysql2";
import { User } from "../../types";
import { db } from "../../db";
import moment from "moment";

export const create = async (user: User): Promise<number> => {
	if (await usernameExists(user.username)) {
		throw new Error("Username is already in use");
	}
	if (await emailExists(user.email_address)) {
		throw new Error("Email address is already in use");
	}
	const query =
		"INSERT INTO users (username, password, email_address) VALUES (?, ?, ?)";
	const [result] = await db
		.promise()
		.query(query, [user.username, user.password, user.email_address]);
	const insertId = (<OkPacket>result).insertId;
	return insertId;
};

export const findOne = async (userId: number): Promise<User> => {
	const query = "SELECT * FROM users WHERE id = ?";
	const [rows] = await db.promise().query(query, userId);
	const users = <unknown[]>rows;
	if (users.length > 0) {
		const row = (<RowDataPacket>rows)[0];
		const user: User = {
			...row,
		};
		return user;
	}
	throw new Error("No user found");
};

export const findByUsernameAndPassword = async (
	username: string,
	password: string
): Promise<User> => {
	const query = "SELECT * FROM users WHERE username = ? AND password = ?";
	const [rows] = await db.promise().query(query, [username, password]);
	const users = <unknown[]>rows;
	if (users.length > 0) {
		const row = (<RowDataPacket>rows)[0];
		const user: User = {
			...row,
		};
		return user;
	}
	throw new Error("No user found");
};

export const findByUsername = async (username: string): Promise<User> => {
	const query = "SELECT * FROM users WHERE username = ?";
	const [rows] = await db.promise().query(query, [username]);
	const users = <unknown[]>rows;
	if (users.length > 0) {
		const row = (<RowDataPacket>rows)[0];
		const user: User = {
			...row,
		};
		return user;
	}
	throw new Error("No user found");
};

export const usernameExists = async (username: string): Promise<boolean> => {
	const query = "SELECT * FROM users WHERE username = ?";
	const [rows] = await db.promise().query(query, [username]);
	const users = <unknown[]>rows;
	return users.length > 0;
};

export const emailExists = async (email: string): Promise<boolean> => {
	const query = "SELECT * FROM users WHERE email_address = ?";
	const [rows] = await db.promise().query(query, [email]);
	const users = <unknown[]>rows;
	return users.length > 0;
};

export const logLogin = async (userId: number, ipAddress: string): Promise<number> => {
	console.log(`User ${userId} logged in with IP: ${ipAddress}`);
	const query =
		"INSERT INTO login_logs (user_id, timestamp, ip_address) VALUES (?, ?, ?)";
	const [result] = await db
		.promise()
		.query(query, [userId, moment.now().valueOf(), ipAddress]);
	const insertId = (<OkPacket>result).insertId;
	return insertId;
};
