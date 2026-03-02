class MessageRewriter:
    def __init__(self):
        # Rule-based rewrites mapping trigger patterns to calmer alternatives and explanations
        self.rules = [
            {
                "patterns": ["you never", "you don't ever"],
                "suggestion": "I sometimes feel unheard in our conversations.",
                "explanation": "Shifting from 'you never' (a generalization) to 'I feel' reduces defensiveness and focuses on your experience."
            },
            {
                "patterns": ["you always", "you're always"],
                "suggestion": "There are times when I notice this happens, and it's hard for me.",
                "explanation": "Replacing 'always' with 'there are times' avoids branding the other person and opens room for change."
            },
            {
                "patterns": ["that's not fair", "it's not fair"],
                "suggestion": "I see this situation differently and would like to share my perspective.",
                "explanation": "Focusing on differing perspectives rather than 'fairness' helps move away from blame towards understanding."
            },
            {
                "patterns": ["you don't understand", "you just don't get it"],
                "suggestion": "I'd like to help you understand how I'm feeling about this.",
                "explanation": "Inviting the other person to understand is more collaborative than stating they already 'don't get it'."
            },
            {
                "patterns": ["stop it", "shut up"],
                "suggestion": "I'm feeling overwhelmed right now and need a short break to think.",
                "explanation": "Identifying your own need for space is more effective than demanding the other person stop their behavior mid-conflict."
            },
            {
                "patterns": ["whatever"],
                "suggestion": "I'm not sure how to respond right now. Can we revisit this later?",
                "explanation": "'Whatever' often signals emotional withdrawal. Suggesting a later time to talk keeps the connection open."
            },
            {
                "patterns": ["you're wrong", "that's wrong"],
                "suggestion": "I have a different perspective on this.",
                "explanation": "Acknowledging multiple perspectives is less confrontational than flatly stating someone is 'wrong'."
            }
        ]

    def rewrite(self, text: str):
        text_lower = text.lower()
        
        for rule in self.rules:
            for pattern in rule["patterns"]:
                if pattern in text_lower:
                    return {
                        "original": text,
                        "suggestion": rule["suggestion"],
                        "explanation": rule["explanation"]
                    }
        
        # Default if no specific trigger phrase is found
        return {
            "original": text,
            "suggestion": "I'd like to express this in a way that helps us stay connected. Can we talk about how I'm feeling?",
            "explanation": "Focusing on connection and 'I' statements generally helps lower the intensity of a conflict."
        }
