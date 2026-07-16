import json
import re
from json_repair import repair_json


def extract_json(text: str) -> dict:
    """
    Ultra-robust JSON extraction that repairs common LLM mistakes:
    - Missing braces/brackets
    - Trailing commas
    - Unescaped quotes
    - Truncated output
    """
    if not text or not text.strip():
        raise ValueError("Empty response from AI")

    text = text.strip()

    # 1. Strip markdown code fences
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```\s*$", "", text)
    text = text.strip()

    # 2. Try direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 3. Extract largest {...} block
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end > start:
        text = text[start:end + 1]

    # 4. Try again
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 5. 🔧 THE MAGIC: use json_repair to auto-fix any structural errors
    try:
        repaired = repair_json(text, return_objects=True)
        if isinstance(repaired, dict) and repaired:
            return repaired
        # Sometimes returns string form
        if isinstance(repaired, str):
            return json.loads(repaired)
    except Exception as e:
        raise ValueError(f"JSON repair failed: {e}. First 300 chars: {text[:300]}")

    raise ValueError("Could not parse or repair JSON")