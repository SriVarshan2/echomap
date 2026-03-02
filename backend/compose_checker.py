import re
import math
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from rewriter import MessageRewriter

class ComposeChecker:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()
        self.rewriter = MessageRewriter()
        
        self.DANGER_PATTERNS = {
            "absolutes": {
                "phrases": ["you never", "you always", "you're always", "never once"],
                "reason": "Absolute language invites argument, not empathy.",
                "severity": 0.8,
                "emotions": ["defensive", "frustrated"]
            },
            "ultimatums": {
                "phrases": ["i'm done", "forget it", "i give up", "don't bother", "whatever"],
                "reason": "Sounds like withdrawal or threat.",
                "severity": 0.7,
                "emotions": ["panicked", "abandoned", "dismissive"]
            },
            "blame": {
                "phrases": ["your fault", "you made me", "because of you", "you ruined"],
                "reason": "Blame framing closes conversations.",
                "severity": 0.9,
                "emotions": ["attacked", "defensive", "hurt"]
            },
            "contempt": {
                "phrases": ["that's ridiculous", "you're being", "grow up", "stop being so"],
                "reason": "Contempt is the strongest predictor of conversation breakdown.",
                "severity": 1.0,
                "emotions": ["belittled", "furious", "withdrawn"]
            },
            "generalizations": {
                "phrases": ["nobody cares", "everyone thinks", "you people", "typical"],
                "reason": "Generalizations feel like attacks.",
                "severity": 0.75,
                "emotions": ["dismissed", "misunderstood"]
            }
        }

    def check_message(self, text: str) -> dict:
        if not text.strip():
            return {
                "tone": "neutral",
                "temperature": 0.0,
                "flagged_phrases": [],
                "predicted_receiver_emotions": ["neutral"],
                "likely_response_type": "open",
                "overall_safe_to_send": True,
                "calmer_version": ""
            }

        text_lower = text.lower()
        flagged_phrases = []
        severity_sum = 0.0
        predicted_emotions = set()
        
        # Check for danger patterns
        for ptype, config in self.DANGER_PATTERNS.items():
            for phrase in config["phrases"]:
                # Use regex to find whole phrase matches and their indices
                # We need word boundaries to avoid partial matches
                # Escaping the phrase because of characters like '
                escaped_phrase = re.escape(phrase)
                matches = re.finditer(rf"\b{escaped_phrase}\b", text_lower)
                
                for match in matches:
                    start, end = match.span()
                    # Calculate original text match to preserve casing
                    original_match = text[start:end]
                    
                    flagged_phrases.append({
                        "phrase": original_match,
                        "start": start,
                        "end": end,
                        "reason": config["reason"],
                        "type": ptype
                    })
                    severity_sum += config["severity"]
                    predicted_emotions.update(config["emotions"])

        # VADER Sentiment
        scores = self.analyzer.polarity_scores(text)
        compound = scores['compound']
        
        # Temperature calculation
        temperature = 0.3  # Baseline
        temperature += (severity_sum * 0.25)  # Scale severity effect
        
        # Add to temperature if sentiment is negative
        if compound < -0.2:
            temperature += abs(compound) * 0.4
            
        temperature = min(1.0, temperature)
        
        # Tone categorization
        if temperature < 0.3:
            tone = "calm"
            likely_response = "open"
            if not predicted_emotions:
                predicted_emotions = {"safe", "heard", "respected"}
        elif temperature < 0.6:
            tone = "tense"
            likely_response = "defensive"
            if not predicted_emotions:
                predicted_emotions = {"guarded", "misunderstood"}
        else:
            tone = "angry"
            likely_response = "withdrawn"
            if not predicted_emotions:
                predicted_emotions = {"hurt", "attacked", "dismissed"}
                
        # Limit to 3 emotions for UI
        final_emotions = list(predicted_emotions)[:3]
        
        # Safe to send?
        safe = temperature < 0.5 and len(flagged_phrases) == 0
        
        # Calmer version logic
        calmer_version = ""
        if not safe:
            # Get rewrite
            rewrite_obj = self.rewriter.rewrite(text)
            suggestion = rewrite_obj["suggestion"]
            
            # Additional I-statement wrapping if the rewrite isn't already doing it well enough
            # But the rewriter usually does a good job.
            if "I feel" not in suggestion and "I noticed" not in suggestion:
                if len(suggestion) > 10:
                    calmer_version = f"I sometimes feel unheard when {suggestion[0].lower() + suggestion[1:]}"
                else:
                    calmer_version = suggestion
            else:
                calmer_version = suggestion
                
            # Fallback if rewrite failed drastically
            if calmer_version == text and temperature > 0.6:
                calmer_version = "I've been feeling unheard lately. Can we talk about what's been happening?"

        return {
            "tone": tone,
            "temperature": round(temperature, 2),
            "flagged_phrases": flagged_phrases,
            "predicted_receiver_emotions": final_emotions,
            "likely_response_type": likely_response,
            "overall_safe_to_send": safe,
            "calmer_version": calmer_version
        }
