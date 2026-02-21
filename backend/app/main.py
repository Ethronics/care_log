import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.config import settings

app = FastAPI(
    title="Log My Care API",
    description="API for Log My Care - Smart Edition",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Log My Care API v1.0",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}


# --- Care log summarization (intelligent when GEMINI_API_KEY is set; free tier) ---

class SummarizeRequest(BaseModel):
    text: str


class SummarizeResponse(BaseModel):
    summary: str


def _simple_summary(text: str, max_sentences: int = 2, max_chars: int = 280) -> str:
    """Fallback when no LLM is configured."""
    t = text.strip()
    if not t:
        return t
    import re
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", t) if s.strip()]
    if len(sentences) <= max_sentences:
        return t
    taken = " ".join(sentences[:max_sentences])
    if len(taken) <= max_chars:
        return taken
    by_chars = t[:max_chars]
    last_space = by_chars.rfind(" ")
    return by_chars[: last_space + 1] if last_space > max_chars // 2 else by_chars


def _force_short_summary(text: str, max_chars: int = 200) -> str:
    """Always return a shortened version so summary and raw are never identical when text is long."""
    t = text.strip()
    if not t or len(t) <= max_chars:
        return t
    import re
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", t) if s.strip()]
    if sentences:
        first = sentences[0]
        if len(first) <= max_chars:
            return first
    by_chars = t[:max_chars]
    last_space = by_chars.rfind(" ")
    return (by_chars[: last_space + 1] if last_space > max_chars // 2 else by_chars) + "…"


def _is_effectively_same(summary: str, original: str) -> bool:
    """True if summary is just the original echoed (no real summarization)."""
    if not summary or not original:
        return True
    s, o = summary.strip().lower(), original.strip().lower()
    if s == o:
        return True
    if len(s) > len(o) * 0.9 and o in s:
        return True
    if s in o and len(s) > 100:
        return True
    return False


def _summarize_with_gemini_sync(text: str) -> str | None:
    """Return summary using Google Gemini (free tier) if key is set, else None. Sync."""
    if not settings.GEMINI_API_KEY:
        return None
    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        system_instruction = """You are a care log summarizer. You receive raw notes from a carer about a service user (e.g. medication given, food, mood, mobility, incidents). Your job is to output a brief professional summary that captures the meaning and intention—what was done, what was observed, and any concern or outcome. Do NOT copy or paraphrase the original; write a fresh one- or two-sentence summary that a colleague could read at a glance. Output only the summary, no labels or quotes."""
        user_content = "Summarize these care notes:\n\n" + text.strip()
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=user_content,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.4,
                max_output_tokens=150,
            ),
        )
        try:
            summary = (response.text or "").strip()
        except (ValueError, AttributeError):
            summary = ""
        for prefix in ('"', "'"):
            if len(summary) > 1 and summary.startswith(prefix) and summary.endswith(prefix):
                summary = summary[1:-1].strip()
        if not summary or _is_effectively_same(summary, text):
            return None
        return summary
    except Exception:
        return None


@app.post("/api/summarize", response_model=SummarizeResponse)
async def summarize_care_log(body: SummarizeRequest):
    """Summarize care log text. Uses Google Gemini (free tier) when GEMINI_API_KEY is set, else a simple extract."""
    text = (body.text or "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")
    summary = await asyncio.to_thread(_summarize_with_gemini_sync, text)
    if summary is None:
        summary = _simple_summary(text)
    if _is_effectively_same(summary, text):
        summary = _force_short_summary(text)
    return SummarizeResponse(summary=summary)