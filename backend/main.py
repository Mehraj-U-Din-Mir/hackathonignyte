"""
ignyte 2026 — FastAPI Backend
Run: uvicorn main:app --reload --port 8000
Docs: http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from api.register import router as register_router
from api.admin    import router as admin_router
from api.qr       import router as qr_router

app = FastAPI(
    title="ignyte 2026 API",
    description="Backend for ignyte 2026 – Future Innovators Hackathon",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register_router, prefix="/api/register", tags=["Registration"])
app.include_router(admin_router,    prefix="/api/admin",    tags=["Admin"])
app.include_router(qr_router,       prefix="/api/qr",       tags=["QR"])

@app.get("/")
def root():
    return {"status": "ok", "service": "ignyte 2026 API", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
