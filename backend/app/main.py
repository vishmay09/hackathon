from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.config import settings
from app.routes import strategy

app = FastAPI(title="Hackathon Commander AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGIN, "https://hackathon-9pihujw0d-vishmay-1595s-projects.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(strategy.router)

@app.get("/health")
async def health():
    return {"status": "ok", "model": settings.NVIDIA_MODEL}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)