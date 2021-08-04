import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import validateAuthToken from "../../middleware/auth";
import * as licenseModel from "../../models/license";

const router = Router();

router.post(
	"/redeem",
	validateAuthToken,
	async (req: Request, res: Response) => {
		const user = req.body.user;
		const existing_license = await licenseModel.fromUser(user.id);
		if (!existing_license) {
			const key = req.body.key;
			if (key) {
				const license_id = await licenseModel.fromKey(key);
				if (license_id) {
					if (await licenseModel.redeem(user.id, license_id)) {
						return res.status(StatusCodes.OK).send();
					} else {
						return res
							.status(StatusCodes.INTERNAL_SERVER_ERROR)
							.json({ error: "Something went wrong. Please try again." });
					}
				} else {
					return res
						.status(StatusCodes.NOT_FOUND)
						.json({ error: "License key not found" });
				}
			} else {
				return res
					.status(StatusCodes.NOT_FOUND)
					.json({ error: "License key not found" });
			}
		} else {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: "You already have an active subscription" });
		}
	}
);

export default router;
