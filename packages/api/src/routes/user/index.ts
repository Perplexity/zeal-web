import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as userModel from "../../models/user";
import child_process from "child_process";
import validateAuthToken from "../../middleware/auth";
import { fetchUserDetails } from "../../middleware/user";
import path from "path";

const router = Router();

router.get("/test", async (req: Request, res: Response) => {
	const process = child_process.spawn("python", [
		path.join(__dirname, "../../../../checker/main.py"),
		"--job=1",
		"--threads=1",
	]);
	return res.status(StatusCodes.OK).json({ pid: process.pid });
});

router.get("/me", [validateAuthToken, fetchUserDetails], async (req: Request, res: Response) => {
	const user = req.body.user;
	console.log(req.body);
	return res.status(StatusCodes.OK).json(user);
});

router.post("/login", async (req: Request, res: Response) => {
	const ip = req.header("x-forwarded-for") || <string>req.socket.remoteAddress;
	if (!req.body.username || !req.body.password) {
		return res.status(StatusCodes.BAD_REQUEST).send();
	} else {
		const { username, password } = req.body;
		try {
			const user = await userModel.findByUsername(username);
			const valid = await bcrypt.compare(password, user.password);
			if (valid) {
				await userModel.logLogin(user.id, ip);
				const userToken = (({ id, username, email_address }) => ({
					id,
					username,
					email_address,
				}))(user);
				return res.status(StatusCodes.OK).json({
					token: jwt.sign(userToken, <string>process.env.JWT_PRIVATE_KEY),
				});
			} else {
				return res
					.status(StatusCodes.UNAUTHORIZED)
					.json({ error: "Wrong password" });
			}
		} catch (ex: any) {
			return res.status(StatusCodes.UNAUTHORIZED).json({ error: ex.message });
		}
	}
});

export default router;
