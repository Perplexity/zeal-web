import axios from "axios";

type VersionsGetter = {
	latest: () => Promise<string>;
	all: () => Promise<string[]>;
}

type ChampionGetter = {
	all: (version: string) => Promise<any>;
	byName: (champName: string, version: string) => Promise<any>;
}

export class DDragon {
	readonly host: string = "https://ddragon.leagueoflegends.com";
	async request<T>(path: string): Promise<T> {
		const resp = await axios.get(`${this.host}${path}`);
		if (resp.data) return resp.data;
		throw resp;
	}
	get versions(): VersionsGetter {
		return {
			latest: async (): Promise<string> => {
				const ddVersions: string[] = await this.request("/api/versions.json");
				return ddVersions[0];
			},
			all: (): Promise<string[]> => this.request("/api/versions.json")
		};
	}

	get champion(): ChampionGetter {
		return {
			all: async (version: string): Promise<any> => {
				const v = version || (await this.versions.latest());
				return await this.request(`/cdn/${v}/data/en_GB/champion.json`);
			},
			byName: async (champName: string, version: string): Promise<any> => {
				const v = version || (await this.versions.latest());
				return await this.request(`/cdn/${v}/data/en_GB/champion/${champName}.json`);
			}
		};
	}
}