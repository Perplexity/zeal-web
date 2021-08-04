from enum import Enum


class Region(Enum):
    EUW = {
        "login": "EUW1",
        "store": "EUW",
        "ledge": "EUW",
        "location": "lolriot.ams1.euw1",
    }

    EUNE = {
        "login": "EUN1",
        "store": "EUN",
        "ledge": "EUNE",
        "location": "lolriot.euc1.eun1",
    }
    NA = {
        "login": "NA1",
        "store": "NA",
        "ledge": "NA",
        "location": "lolriot.pdx2.na1",
    }
    LAN = {
        "login": "LA1",
        "store": "LA1",
        "ledge": "LAN",
        "location": "lolriot.mia1.la1",
    }
    LAS = {
        "login": "LA2",
        "store": "LA2",
        "ledge": "LAS",
        "location": "lolriot.mia1.la2",
    }
    RU = {
        "login": "RU",
        "store": "RU",
        "ledge": "RU",
        "location": "lolriot.euc1.ru",
    }
    OCE = {
        "login": "OC1",
        "store": "OCE",
        "ledge": "OCE",
        "location": "lolriot.pdx1.oc1",
    }
    BR = {
        "login": "BR1",
        "store": "BR",
        "ledge": "BR",
        "location": "lolriot.mia1.br1",
    }
    TR = {
        "login": "TR1",
        "store": "TR",
        "ledge": "TR",
        "location": "lolriot.euc1.tr1",
    }
    JP = {
        "login": "JP1",
        "store": "JP",
        "ledge": "JP",
        "location": "lolriot.nrt1.jp1",
    }
