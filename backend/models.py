from pydantic import BaseModel
from typing import List, Optional

class AnalysisRequest(BaseModel):
    conversation: str
    speaker_a: str = "Person A"
    speaker_b: str = "Person B"

class MessageAnalysis(BaseModel):
    id: int
    speaker: str
    text: str
    sentiment_score: float
    sentiment_label: str
    intensity: float
    is_escalation_point: bool
    is_empathy_moment: bool
    trigger_phrases: List[str]

class Reflection(BaseModel):
    type: str # "observation", "trigger", "empathy"
    message: str
    index: Optional[int] = None
    phrase: Optional[str] = None

class AnalysisSummary(BaseModel):
    empathy_score: int
    balance_score: int
    escalation_points: List[int]
    peak_intensity_index: int
    dominant_emotion_a: str
    dominant_emotion_b: str
    crisis_detected: bool
    overall_arc: str

class AnalysisResponse(BaseModel):
    messages: List[MessageAnalysis]
    summary: AnalysisSummary
    reflections: List[Reflection]

class RewriteRequest(BaseModel):
    original_message: str

class RewriteResponse(BaseModel):
    original: str
    suggestion: str
    explanation: str

class ComposeRequest(BaseModel):
    message: str

class FlaggedPhrase(BaseModel):
    phrase: str
    start: int
    end: int
    reason: str
    type: str

class ComposeResponse(BaseModel):
    tone: str
    temperature: float
    flagged_phrases: List[FlaggedPhrase]
    predicted_receiver_emotions: List[str]
    likely_response_type: str
    overall_safe_to_send: bool
    calmer_version: str
