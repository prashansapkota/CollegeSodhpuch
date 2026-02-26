from typing import Any


def generate_workflow_steps(profile: dict[str, Any]) -> list[dict[str, Any]]:
    return [
        {
            "step": 1,
            "title": "Collect requirements",
            "status": "pending",
            "details": f"Stub workflow for {profile.get('target_country', 'target country')}.",
        }
    ]
