from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import AnalysisRequest, AnalysisResponse, RewriteRequest, RewriteResponse, AnalysisSummary
from analyzer import ConversationAnalyzer
from rewriter import MessageRewriter

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

analyzer = ConversationAnalyzer()
rewriter = MessageRewriter()

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
# Analyze Route
# ----------------------------
@app.post("/analyze", response_model=AnalysisResponse)
def analyze(data: AnalysisRequest):
    # Parse conversation
    messages = analyzer.parse_conversation(data.conversation, data.speaker_a, data.speaker_b)
    
    # Analyze each message
    analyzed_messages = []
    for i, msg in enumerate(messages):
        analyzed_messages.append(analyzer.analyze_message(i, msg["speaker"], msg["text"]))
    
    # Detect escalation
    escalation_points = analyzer.detect_escalation(analyzed_messages)
    
    # Calculate scores
    empathy_score = analyzer.calculate_empathy_score(analyzed_messages)
    balance_score = analyzer.calculate_balance_score(analyzed_messages, data.speaker_a, data.speaker_b)
    
    # Simple defaults for other summary fields
    summary = AnalysisSummary(
        empathy_score=empathy_score,
        balance_score=balance_score,
        escalation_points=escalation_points,
        peak_intensity_index=0 if not analyzed_messages else analyzed_messages.index(max(analyzed_messages, key=lambda x: x["intensity"])),
        dominant_emotion_a="Calm",
        dominant_emotion_b="Understanding",
        crisis_detected=False,
        overall_arc="stable" if not escalation_points else "escalating"
    )
    
    return {
        "messages": analyzed_messages,
        "summary": summary,
        "reflections": analyzer.get_reflections(analyzed_messages)
    }

# ----------------------------
# Rewrite Route
# ----------------------------
@app.post("/rewrite", response_model=RewriteResponse)
def rewrite(data: RewriteRequest):
    result = rewriter.rewrite(data.original_message)
    return result