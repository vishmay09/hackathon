import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    NVIDIA_API_KEY: str = os.getenv("NVIDIA_API_KEY", "")
    NVIDIA_BASE_URL: str = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    NVIDIA_MODEL: str = os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3-ultra-550b-a55b")
    PORT: int = int(os.getenv("PORT", 8000))
    CORS_ORIGIN: str = os.getenv("CORS_ORIGIN", "http://localhost:5173")
    REQUEST_TIMEOUT: int = 120
    MAX_RETRIES: int = 3

settings = Settings()