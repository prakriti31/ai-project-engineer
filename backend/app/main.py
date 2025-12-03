import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .processor import analyze_document_bytes
from .schemas import AnalysisResponse
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Project Engineer Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # for demo; lock this down in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(file: UploadFile = File(...)):
    try:
        content = await file.read()
        # Simple check
        if not content:
            raise HTTPException(status_code=400, detail="Empty file")
        result = analyze_document_bytes(content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
