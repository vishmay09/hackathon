import httpx
import json
import asyncio
from typing import AsyncGenerator, Optional
from app.config import settings

class NemotronService:
    def __init__(self):
        self.base_url = settings.NVIDIA_BASE_URL
        self.api_key = settings.NVIDIA_API_KEY
        self.model = settings.NVIDIA_MODEL

    def _headers(self):
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    async def complete(self, system: str, user: str, temperature: float = 0.5,
                       max_tokens: int = 8000) -> str:
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": temperature,
            "top_p": 0.9,
            "max_tokens": max_tokens,
            "stream": False,
        }

        last_err: Optional[Exception] = None
        for attempt in range(settings.MAX_RETRIES):
            try:
                async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT) as client:
                    resp = await client.post(
                        f"{self.base_url}/chat/completions",
                        headers=self._headers(),
                        json=payload,
                    )
                    resp.raise_for_status()
                    data = resp.json()
                    return data["choices"][0]["message"]["content"]
            except Exception as e:
                last_err = e
                await asyncio.sleep(1.5 * (attempt + 1))
        raise RuntimeError(f"Nemotron API failed after retries: {last_err}")

    async def stream(self, system: str, user: str, temperature: float = 0.5,
                     max_tokens: int = 8000) -> AsyncGenerator[str, None]:
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": temperature,
            "top_p": 0.9,
            "max_tokens": max_tokens,
            "stream": True,
        }
        async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT) as client:
            async with client.stream("POST", f"{self.base_url}/chat/completions",
                                     headers=self._headers(), json=payload) as resp:
                async for line in resp.aiter_lines():
                    if not line or not line.startswith("data: "):
                        continue
                    chunk = line[6:]
                    if chunk.strip() == "[DONE]":
                        break
                    try:
                        j = json.loads(chunk)
                        delta = j["choices"][0]["delta"].get("content", "")
                        if delta:
                            yield delta
                    except Exception:
                        continue

nemotron = NemotronService()