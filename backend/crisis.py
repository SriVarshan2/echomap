# Simple crisis detection based on keywords
# In a real app, this would be much more sophisticated.

CRISIS_KEYWORDS = [
    "hurt myself", "kill myself", "suicide", "end it all",
    "hit you", "hurt you", "kill you", "punch", "threaten"
]

def detect_crisis(messages):
    for m in messages:
        text = m["text"].lower()
        if any(keyword in text for keyword in CRISIS_KEYWORDS):
            return True
    return False
