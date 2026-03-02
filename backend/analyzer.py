import re
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from typing import List, Dict

class ConversationAnalyzer:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()
        
        # Trigger phrases that often cause defensiveness
        self.trigger_phrases = [
            "you never", "you always", "you don't",
            "that's not fair", "you're wrong",
            "stop it", "whatever", "fine",
            "forget it", "you don't understand"
        ]
        
        # Empathy indicators
        self.empathy_phrases = [
            "i understand", "i hear you", "that makes sense",
            "i'm sorry", "you're right", "i see why",
            "that must be", "i can imagine", "thank you for"
        ]

    def parse_conversation(self, text: str, speaker_a: str, speaker_b: str) -> List[Dict]:
        lines = text.strip().split("\n")
        parsed_messages = []
        current_speaker = None
        
        # Clean names for regex
        name_a = re.escape(speaker_a)
        name_b = re.escape(speaker_b)
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            match = re.match(fr"^({name_a}|{name_b}):\s*(.*)", line, re.IGNORECASE)
            if match:
                current_speaker = match.group(1)
                message_text = match.group(2)
                parsed_messages.append({"speaker": current_speaker, "text": message_text})
            elif current_speaker and parsed_messages:
                # Continuation of previous message
                parsed_messages[-1]["text"] += " " + line
        
        return parsed_messages

    def analyze_message(self, index: int, speaker: str, text: str) -> Dict:
        scores = self.analyzer.polarity_scores(text)
        compound = scores["compound"]
        
        sentiment_label = "neutral"
        if compound >= 0.05:
            sentiment_label = "positive"
        elif compound <= -0.05:
            sentiment_label = "negative"
            
        intensity = abs(compound)
        
        found_triggers = [p for p in self.trigger_phrases if p in text.lower()]
        found_empathy = [p for p in self.empathy_phrases if p in text.lower()]
        
        return {
            "id": index,
            "speaker": speaker,
            "text": text,
            "sentiment_score": compound,
            "sentiment_label": sentiment_label,
            "intensity": intensity,
            "is_escalation_point": False, # Calculated later
            "is_empathy_moment": len(found_empathy) > 0,
            "trigger_phrases": found_triggers
        }

    def detect_escalation(self, messages: List[Dict]) -> List[int]:
        escalation_indices = []
        for i in range(1, len(messages)):
            # Escalation: sentiment drops more than 0.4 within 3 consecutive messages
            # Simple check: current vs previous
            prev_sentiment = messages[i-1]["sentiment_score"]
            curr_sentiment = messages[i]["sentiment_score"]
            if (prev_sentiment - curr_sentiment) > 0.4:
                escalation_indices.append(i)
                messages[i]["is_escalation_point"] = True
        return escalation_indices

    def calculate_empathy_score(self, messages: List[Dict]) -> int:
        if not messages:
            return 0
        empathy_count = sum(1 for m in messages if m["is_empathy_moment"])
        score = int((empathy_count / len(messages)) * 100 * 2) # Weighted for visibility
        return min(max(score, 0), 100)

    def calculate_balance_score(self, messages: List[Dict], speaker_a: str, speaker_b: str) -> int:
        speaker_counts = {}
        for msg in messages:
            speaker_counts[msg['speaker']] = speaker_counts.get(msg['speaker'], 0) + 1
            
        if len(speaker_counts) < 2:
            return 50
            
        counts = list(speaker_counts.values())
        ratio = min(counts) / max(counts)
        return round(ratio * 100)

    def get_reflections(self, messages: List[Dict]) -> List[Dict]:
        reflections = []
        
        # Escalation reflection
        escalations = [m for m in messages if m["is_escalation_point"]]
        if escalations:
            reflections.append({
                "type": "observation",
                "message": "Something shifted early — around the second message, the tone started to change.",
                "index": escalations[0]['id']
            })
            
        # Trigger reflection
        all_triggers = []
        for m in messages:
            all_triggers.extend(m["trigger_phrases"])
            
        if all_triggers:
            most_common = max(set(all_triggers), key=all_triggers.count)
            count = all_triggers.count(most_common)
            time_str = "once" if count == 1 else f"{count} times"
            # Keep original case for the phrase quote but lowercase it for the sentence
            phrase_display = most_common.capitalize()
            reflections.append({
                "type": "trigger",
                "message": f"'{phrase_display}' — even {time_str}, this phrase tends to put people on the back foot.",
                "phrase": most_common
            })
            
        # Empathy reflection
        empathy_moments = [m for m in messages if m["is_empathy_moment"]]
        if empathy_moments:
            reflections.append({
                "type": "empathy",
                "message": "Here, someone actually stopped and listened. It did not last long, but it was there.",
                "index": empathy_moments[0]['id']
            })
            
        return reflections
