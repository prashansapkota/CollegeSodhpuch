from typing import Any


def retrieve_documents(query: str) -> list[dict[str, Any]]:
    return [
        {
            "source": "stub",
            "title": "No retrieval backend configured",
            "content": f"Placeholder retrieval result for query: {query}",
        }
    ]
