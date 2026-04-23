from contextlib import asynccontextmanager
import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import Base, engine
from app.routers import auth, chat, health, users

logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger("app.main")


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info(
        "startup_begin app=%s debug=%s allowed_origins_raw=%s",
        settings.app_name,
        settings.debug,
        settings.allowed_origins,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info(
        "startup_complete db_connected=%s groq_key_present=%s",
        True,
        bool(settings.groq_api_key),
    )
    yield


app = FastAPI(title=settings.app_name, debug=settings.debug, lifespan=lifespan)

allowed_origins = [o.strip() for o in settings.allowed_origins.split(",") if o.strip()]
allow_all_origins = "*" in allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all_origins else allowed_origins,
    # Browsers reject wildcard origin with credentials=True.
    allow_credentials=not allow_all_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    start = time.perf_counter()
    origin = request.headers.get("origin", "-")
    user_agent = request.headers.get("user-agent", "-")
    method = request.method
    path = request.url.path

    logger.info(
        "request_start method=%s path=%s origin=%s ua=%s",
        method,
        path,
        origin,
        user_agent[:120],
    )
    try:
        response = await call_next(request)
    except Exception:
        duration_ms = int((time.perf_counter() - start) * 1000)
        logger.exception(
            "request_exception method=%s path=%s origin=%s duration_ms=%s",
            method,
            path,
            origin,
            duration_ms,
        )
        return JSONResponse({"detail": "Internal server error"}, status_code=500)

    duration_ms = int((time.perf_counter() - start) * 1000)
    logger.info(
        "request_end method=%s path=%s status=%s duration_ms=%s origin=%s",
        method,
        path,
        response.status_code,
        duration_ms,
        origin,
    )
    if method == "OPTIONS" and response.status_code >= 400:
        logger.warning(
            "cors_preflight_failed path=%s status=%s origin=%s allowed_origins=%s",
            path,
            response.status_code,
            origin,
            "*" if allow_all_origins else allowed_origins,
        )
    return response


app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
