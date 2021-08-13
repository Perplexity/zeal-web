import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import validateAuthToken from "../../middleware/auth";
import * as comboModel from "../../models/combo";
import * as jobModel from "../../models/job";
import * as resultModel from "../../models/result";
import { ComboResult, Summoner } from "../../types";

const router = Router();

interface ResultRequest {
  result: ComboResult;
  summoner?: Summoner;
}

router.get("/", validateAuthToken, async (req: Request, res: Response) => {
	const { user } = req.body;
	const jobs = await jobModel.findAll(user.id);
	return res.status(StatusCodes.OK).json(jobs);
});

router.get(
	"/:job_id/combos",
	validateAuthToken,
	async (req: Request, res: Response) => {
		const { user, isRoot } = req.body;
		const job_id = parseInt(req.params.job_id);
		if (isRoot || (await jobModel.belongsToUser(job_id, user.id))) {
			const combos = await comboModel.pendingFromJob(job_id);
			return res.status(StatusCodes.OK).json(combos);
		} else {
			return res.status(StatusCodes.NOT_FOUND).send();
		}
	}
);

router.post(
	"/:job_id/complete",
	validateAuthToken,
	async (req: Request, res: Response) => {
		const { isRoot } = req.body;
		const job_id = parseInt(req.params.job_id);
		if (isRoot) {
			if (await jobModel.markAsCompleted(job_id)) {
				return res.status(StatusCodes.OK).send();
			} else {
				return res
					.status(StatusCodes.BAD_REQUEST)
					.json({ error: "Failed to mark job as complete" });
			}
		} else {
			return res.status(StatusCodes.NOT_FOUND).send();
		}
	}
);

router.get(
	"/results/:job_id",
	validateAuthToken,
	async (req: Request, res: Response) => {
		const { user } = req.body;
		const job_id = parseInt(req.params.job_id);
		if (await jobModel.belongsToUser(job_id, user.id)) {
			const hits = await resultModel.fromJob(job_id);
			return res.status(StatusCodes.OK).json(hits);
		} else {
			return res.status(StatusCodes.NOT_FOUND).send();
		}
	}
);

router.post(
	"/results/:combo_id",
	validateAuthToken,
	async (req: Request, res: Response) => {
		const { isRoot } = req.body;
		if (isRoot) {
			const resultReq: ResultRequest = req.body;
			const combo_id = parseInt(req.params.combo_id);
			await jobModel.setComboResult(combo_id, resultReq.result);
			if (resultReq.summoner) {
				console.log("Summoner added", resultReq.summoner);
				await jobModel.addHit(combo_id, resultReq.summoner);
			}
			return res.status(StatusCodes.OK).send();
		} else {
			return res.status(StatusCodes.UNAUTHORIZED).send();
		}
	}
);

export default router;
