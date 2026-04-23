import logging
from fastapi import APIRouter, HTTPException
from groq import Groq
from pydantic import BaseModel

from app.config import settings

router = APIRouter()
logger = logging.getLogger("app.routers.chat")

SYSTEM_PROMPT = """You are CollegeSodhpuch, a helpful and knowledgeable college application advisor
specializing in helping students from Nepal apply to universities in the United States.

You have deep expertise in:
- Building balanced college lists (dream, match, and safety schools)
- SAT preparation strategy and score improvement
- The F-1 student visa process for Nepali students, including DS-160, SEVIS, and embassy interviews
- Common App essays and application timelines
- Scholarship opportunities for international students
- Financial documentation required for visa and admissions

Your responses should be:
- Clear, specific, and actionable — give real steps, not vague advice
- Concise but thorough — answer the question fully without rambling
- Encouraging but honest — don't overpromise on admissions outcomes

Always keep in mind that your users are Nepali students navigating an unfamiliar system,
so explain acronyms and American-specific processes when they come up."""


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        if not settings.groq_api_key:
            logger.error("chat_rejected reason=missing_groq_key")
            raise HTTPException(
                status_code=500,
                detail="GROQ_API_KEY is not configured on the server."
            )

        # Create the Groq client — works almost identically to the Anthropic client
        client = Groq(api_key=settings.groq_api_key)

        # Build the messages list: system prompt first, then the conversation
        messages_for_api = [{"role": "system", "content": SYSTEM_PROMPT}]
        for msg in request.messages:
            messages_for_api.append({
                "role": msg.role if msg.role == "user" else "assistant",
                "content": msg.content,
            })

        latest_preview = request.messages[-1].content[:80] if request.messages else ""
        logger.info(
            "chat_request_received messages_count=%s latest_preview=%s",
            len(request.messages),
            latest_preview,
        )

        # Call Groq with llama-3.3-70b — fast, free, and very capable
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages_for_api,
            max_tokens=1024,
        )

        reply_text = response.choices[0].message.content
        logger.info("chat_response_success reply_preview=%s", (reply_text or "")[:120])

        return ChatResponse(reply=reply_text)

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("chat_request_failed error=%s", str(e))
        raise HTTPException(status_code=500, detail=str(e))
