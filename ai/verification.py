from typing import Any


def verify_information(records: list[dict[str, Any]]) -> dict[str, Any]:
    return {
        "verified": False,
        "confidence": 0.0,
        "notes": "Verification pipeline is stubbed.",
        "records_count": len(records),
    }
