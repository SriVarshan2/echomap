from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="EchoMap API",
    description="AI-powered emotional conversation analyzer backend",
    version="1.0.0"
)

# ----------------------------
# CORS (Allow frontend access)
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL later for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Root Route
# ----------------------------
@app.get("/")
def root():
    return {
        "message": "EchoMap API is running 🚀",
        "status": "success"
    }

# ----------------------------
# Health Check Route
# ----------------------------
@app.get("/health")
def health():
    return {
        "status": "ok"
    }

# ----------------------------
# Example Analyze Route
# ----------------------------
class AnalyzeRequest(BaseModel):
    text: str


@app.post("/analyze")
def analyze(data: AnalyzeRequest):
    text = data.text.lower()

    # Simple demo logic (you can replace with ML later)
    if "angry" in text or "hate" in text:
        sentiment = "negative"
    elif "happy" in text or "love" in text:
        sentiment = "positive"
    else:
        sentiment = "neutral"

    return {
        "original_text": data.text,
        "sentiment": sentiment
    }