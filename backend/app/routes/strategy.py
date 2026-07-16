from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
import json, io, traceback, sys
from PyPDF2 import PdfReader
from docx import Document

from app.models.schemas import StrategyRequest, PreviewRequest, PreviewResponse
from app.services.nemotron_service import nemotron
from app.services.prompt_builder import (
    SYSTEM_PROMPT, build_strategy_prompt, build_preview_prompt
)
from app.utils.parser import extract_json

router = APIRouter(prefix="/api", tags=["strategy"])


@router.post("/strategy/generate")
async def generate_strategy(req: StrategyRequest):
    print("\n" + "="*80, flush=True)
    print("🚀 GENERATE STRATEGY REQUEST", flush=True)
    print(f"Statement: {req.statement[:100]}...", flush=True)
    print(f"Roles: {req.team_roles}", flush=True)
    print("="*80, flush=True)

    try:
        prompt = build_strategy_prompt(req)
        print("📤 Sending to Nemotron...", flush=True)

        raw = await nemotron.complete(
            SYSTEM_PROMPT, prompt,
            temperature=0.5,
            max_tokens=16000,   # increased!
        )

        print(f"✅ Response received: {len(raw)} chars", flush=True)
        print(f"First 200 chars: {raw[:200]}", flush=True)
        print(f"Last 200 chars: {raw[-200:]}", flush=True)

        try:
            data = extract_json(raw)
            print(f"✅ JSON parsed successfully. Keys: {list(data.keys())[:5]}...", flush=True)
            return {"success": True, "strategy": data}

        except Exception as parse_err:
            print(f"❌ JSON PARSE FAILED: {parse_err}", flush=True)
            print(f"FULL RAW RESPONSE:\n{raw}", flush=True)
            raise HTTPException(
                status_code=502,
                detail=f"AI returned invalid JSON: {str(parse_err)[:200]}"
            )

    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 EXCEPTION: {type(e).__name__}: {e}", flush=True)
        print(traceback.format_exc(), flush=True)
        sys.stdout.flush()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")


@router.post("/strategy/preview", response_model=PreviewResponse)
async def preview(req: PreviewRequest):
    try:
        raw = await nemotron.complete(
            "You are a hackathon analyst. Return ONLY compact JSON, no prose.",
            build_preview_prompt(req.statement, req.team_roles),
            temperature=0.3, max_tokens=300,
        )
        data = extract_json(raw)
        return PreviewResponse(**data)
    except Exception as e:
        print(f"Preview fallback: {e}", flush=True)
        return PreviewResponse(
            complexity="Medium", innovation_score=65,
            difficulty="Moderate", build_time_hours=20, winning_potential=70,
        )


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    text = ""
    name = file.filename.lower()
    try:
        if name.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(content))
            text = "\n".join(p.extract_text() or "" for p in reader.pages)
        elif name.endswith(".docx"):
            doc = Document(io.BytesIO(content))
            text = "\n".join(p.text for p in doc.paragraphs)
        elif name.endswith(".txt"):
            text = content.decode("utf-8", errors="ignore")
        else:
            raise HTTPException(400, "Unsupported file type")
        return {"text": text.strip()}
    except Exception as e:
        raise HTTPException(500, str(e))