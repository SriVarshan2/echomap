"use client";

import { MessageSquare, AlertCircle, Heart, Zap } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Message {
    id: number;
    speaker: string;
    text: string;
    sentiment_score: number;
    sentiment_label: string;
    intensity: number;
    is_escalation_point: boolean;
    is_empathy_moment: boolean;
    trigger_phrases: string[];
}

interface ConversationTimelineProps {
    messages: Message[];
    onSuggestRewrite?: (message: string) => void;
}

export default function ConversationTimeline({ messages, onSuggestRewrite }: ConversationTimelineProps) {
    const speakerA = messages.length > 0 ? messages[0].speaker : "Speaker A";

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-card-border">
                <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    The conversation, message by message
                </h2>
                <span className="text-[10px] text-text-muted font-mono">{messages.length} Messages</span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {messages.map((msg) => {
                    const isPersonA = msg.speaker === speakerA;
                    const isPositive = msg.sentiment_score > 0.05;
                    const isNegative = msg.sentiment_score < -0.05;
                    const sentimentColor = isPositive ? "bg-positive" : isNegative ? "bg-negative" : "bg-neutral";

                    let sentimentWord = "neutral";
                    if (msg.sentiment_score > 0.4) sentimentWord = "warm";
                    else if (msg.sentiment_score > 0.05) sentimentWord = "calm";
                    else if (msg.sentiment_score < -0.4) sentimentWord = "tense";
                    else if (msg.sentiment_score < -0.05) sentimentWord = "cool";

                    // Handle inline trigger dots
                    let messageDisplay = <>{msg.text}</>;
                    if (msg.trigger_phrases.length > 0) {
                        const trigger = msg.trigger_phrases[0];
                        const parts = msg.text.split(new RegExp(`(${trigger})`, 'gi'));
                        messageDisplay = (
                            <>
                                {parts.map((part, i) =>
                                    part.toLowerCase() === trigger.toLowerCase()
                                        ? <span key={i}>{part}<span className="text-warning text-[12px] inline-block ml-0.5 cursor-help" title="This phrase often increases defensiveness.">●</span></span>
                                        : <span key={i}>{part}</span>
                                )}
                            </>
                        );
                    }

                    return (
                        <div key={msg.id} className="relative group">
                            {/* Human Tension Annotation */}
                            {msg.is_escalation_point && (
                                <div className="flex items-center mt-6 mb-2">
                                    <span className="text-[10px] text-negative italic mr-4">tension rose here</span>
                                    <div className="flex-1 border-t border-negative/20"></div>
                                </div>
                            )}

                            <div
                                className={cn(
                                    "flex gap-4 p-4 glass-card transition-all",
                                    msg.is_escalation_point ? "shadow-[inset_4px_0_12px_rgba(248,113,113,0.05)]" : ""
                                )}
                                style={{
                                    flexDirection: isPersonA ? 'row' : 'row-reverse'
                                }}
                            >
                                {/* Distinct Speaker Avatar */}
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm",
                                    isPersonA ? "bg-primary" : "bg-[#34d399]"
                                )}>
                                    {msg.speaker.charAt(0).toUpperCase()}
                                </div>

                                {/* Message Content */}
                                <div className={cn("flex-1 space-y-2", isPersonA ? "text-left" : "text-right")}>
                                    <div className={cn("flex items-start", isPersonA ? "justify-start" : "justify-end")}>
                                        <span className="text-xs font-bold text-text-primary font-mono opacity-60">{msg.speaker}</span>
                                    </div>

                                    <p className="text-sm text-text-primary leading-relaxed italic">
                                        "{messageDisplay}"
                                    </p>

                                    {/* Watermark Sentiment Bar */}
                                    <div className={cn("pt-2 flex items-center gap-3 opacity-60", isPersonA ? "flex-row" : "flex-row-reverse")}>
                                        <div className="flex-1 h-1 bg-card-border rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full transition-all duration-1000", sentimentColor)}
                                                style={{ width: `${Math.min(msg.intensity * 100, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-text-muted uppercase tracking-wider">{sentimentWord}</span>
                                    </div>

                                    {/* Selective Rewrite Button with Curious Phrasing */}
                                    {(msg.trigger_phrases.length > 0 || msg.sentiment_score < -0.3) && onSuggestRewrite && (
                                        <div className={cn("pt-2", isPersonA ? "text-left" : "text-right")}>
                                            <button
                                                onClick={() => onSuggestRewrite(msg.text)}
                                                className="text-[10px] items-center gap-1.5 text-primary/80 hover:text-primary transition-colors hover:underline group/btn inline-flex"
                                            >
                                                <span>Could this land differently? →</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
