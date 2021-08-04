import { NextFunction, Request, Response } from "express";
import * as licenseModel from "../models/license";
import * as comboModel from "../models/combo";
import { User } from "../types";

export const fetchUserDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	let user: User = req.body.user;
	const license = await licenseModel.fromUser(user.id);
	const comboStats = await comboModel.getStats(user.id);
	user = {...user, license: license, combo_stats: comboStats};
	req.body.user = user;
	next();
};