from typing import Any


def recommend_universities(profile: dict[str, Any]) -> list[dict[str, Any]]:
    return [
        {
            "name": "Sample University",
            "country": profile.get("target_country", "Unknown"),
            "reason": "Recommendation engine is currently a stub.",
        }
    ]
