from enum import Enum


class CrackResult(Enum):
    SUCCESS = 1
    BAD_FORMAT = 2
    NOT_CREATED = 3
    ARCHIVED = 4
    BANNED = 5
    UNDER_LEVEL = 6
    FAILED = 7
    RETRY = 8
