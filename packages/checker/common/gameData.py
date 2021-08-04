import requests


class GameData:
    def __init__(self):
        response = requests.get("http://localhost:3001/api/game_data")
        result = response.json()
        self.version = result["data_dragon_version"]
        self.champions = result["champions"]
        self.skins = result["skins"]
