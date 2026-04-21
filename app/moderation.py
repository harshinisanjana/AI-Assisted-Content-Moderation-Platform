import re

MIN_CONTENT_LENGTH = 50
MAX_CONTENT_LENGTH = 2000

BANNED_WORDS = {
    "damn",
    "dumb",
    "idiot",
    "moron",
    "stupid",
    "shit",
}

AGGRESSIVE_KEYWORDS = {
    "destroy",
    "hate",
    "kill",
    "loser",
    "pathetic",
}


def _extract_lowercase_words(content: str) -> list[str]:
    return re.findall(r"\b[a-zA-Z']+\b", content.lower())


def _banned_word_hits(content: str) -> list[str]:
    words = set(_extract_lowercase_words(content))
    return sorted(words.intersection(BANNED_WORDS))


def _aggressive_keyword_hits(content: str) -> list[str]:
    words = set(_extract_lowercase_words(content))
    return sorted(words.intersection(AGGRESSIVE_KEYWORDS))


def _is_all_caps(content: str) -> bool:
    letters = "".join(ch for ch in content if ch.isalpha())
    if not letters:
        return False
    return letters.isupper()


def _is_overly_aggressive(content: str) -> bool:
    if content.count("!") >= 4 or "!!!" in content:
        return True
    return len(_aggressive_keyword_hits(content)) > 0


def moderate_content(content: str) -> list[str]:
    reasons: list[str] = []
    content_length = len(content)

    if content_length < MIN_CONTENT_LENGTH:
        reasons.append(
            f"Content is too short. Minimum length is {MIN_CONTENT_LENGTH} characters."
        )

    if content_length > MAX_CONTENT_LENGTH:
        reasons.append(
            f"Content is too long. Maximum length is {MAX_CONTENT_LENGTH} characters."
        )

    banned_hits = _banned_word_hits(content)
    if banned_hits:
        reasons.append(f"Banned words detected: {', '.join(banned_hits)}.")

    if _is_all_caps(content):
        reasons.append("Tone appears aggressive because the content is written in ALL CAPS.")

    aggressive_hits = _aggressive_keyword_hits(content)
    if _is_overly_aggressive(content):
        if aggressive_hits:
            reasons.append(
                "Tone appears overly aggressive due to wording: "
                f"{', '.join(aggressive_hits)}."
            )
        else:
            reasons.append("Tone appears overly aggressive due to excessive punctuation.")

    return reasons
