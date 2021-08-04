import { Request, Response, Router } from "express";
import { DDragon } from "../../db/DataDragon";
import * as fs from "fs";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
	const dd = new DDragon();
	const ddVersion = await dd.versions.latest();
	const champions = fs.existsSync("ddragon/champions.json")
		? JSON.parse(fs.readFileSync("ddragon/champions.json").toString())
		: [];
	const skins = fs.existsSync("ddragon/skins.json")
		? JSON.parse(fs.readFileSync("ddragon/skins.json").toString())
		: [];
	return res.status(StatusCodes.OK).json({
		data_dragon_version: ddVersion,
		champions: champions,
		skins: skins,
	});
});

router.put("/", async (req: Request, res: Response) => {
	const dd = new DDragon();
	const ddVersion = await dd.versions.latest();
	const { data: champions } = await dd.champion.all(ddVersion);
	const exportChamps = [];
	const exportSkins = [];
	for (const champName in champions) {
		const { id, key, name } = champions[champName];
		const champion = { id: id, key: key, name: name };
		exportChamps.push(champion);
		const { data: champ } = await dd.champion.byName(champName, ddVersion);
		const skins = champ[champName].skins;
		for (let i = 0; i < skins.length; i++) {
			const skin = skins[i];
			const { id: skinId, name: skinName } = skin;
			const champSkin = {
				id: skinId,
				champId: champion.key,
				name: skinName,
			};
			exportSkins.push(champSkin);
		}
	}
	if (!fs.existsSync("ddragon")) {
		fs.mkdirSync("ddragon");
	}
	fs.writeFileSync("ddragon/champions.json", JSON.stringify(exportChamps));
	fs.writeFileSync("ddragon/skins.json", JSON.stringify(exportSkins));
	return res.status(StatusCodes.OK).json({ message: "Updated data." });
});

export default router;
