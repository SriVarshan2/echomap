"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts";
import { MessageSquare } from "lucide-react";

const DEMO_MESSAGES = [
    { id: 1, speaker: "A", text: "I feel like you never listen.", score: -0.3, type: "normal" },
    { id: 2, speaker: "B", text: "That's not fair, I always try.", score: -0.5, type: "escalation" },
    { id: 3, speaker: "A", text: "Trying isn't the same as doing.", score: -0.4, type: "normal" },
    { id: 4, speaker: "B", text: "I don't know what you want.", score: -0.6, type: "escalation" },
    { id: 5, speaker: "A", text: "I just want to feel heard.", score: -0.1, type: "normal" },
    { id: 6, speaker: "B", text: "I hear you. I'm sorry.", score: 0.4, type: "empathy" }
];

export default function AutoPlayDemo() {
    const [step, setStep] = useState(0);

    // Auto-advance the animation
    useEffect(() => {
        const timer = setInterval(() => {
            setStep((s) => {
                if (s >= DEMO_MESSAGES.length) {
                    clearInterval(timer);
                    setTimeout(() => setStep(0), 4000); // Loop after 4s pause
                    return s;
                }
                return s + 1;
            });
        }, 800);

        return () => clearInterval(timer);
    }, [step]);

    const visibleMessages = DEMO_MESSAGES.slice(0, step);

    // Build chart data up to current step. We pad to keep x-axis stable, or just let it grow.
    // To make it look like it's drawing left-to-right on a fixed timeline, we map all 6 x-points
    // but only provide Y values for visible ones.
    const chartData = DEMO_MESSAGES.map((m, idx) => ({
        index: idx,
        val: idx < step ? m.score : null,
        isEscalation: idx < step && m.type === "escalation",
        isEmpathy: idx < step && m.type === "empathy"
    }));

    return (
        <div className="w-full glass-card p-6 rounded-2xl shadow-[0_0_40px_rgba(139,119,247,0.15)] space-y-6 border border-primary/20 relative overflow-hidden bg-background/80 backdrop-blur-xl">
            {/* Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(139,119,247,0.3)]">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live Demo
            </div>

            <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Emotional Map
                </h3>
            </div>

            {/* Mini Chart Area */}
            <div className="h-[120px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="demoGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <YAxis domain={[-1, 1]} hide />
                        <Area
                            type="monotone"
                            dataKey="val"
                            stroke="var(--color-primary)"
                            strokeWidth={3}
                            fill="url(#demoGradient)"
                            isAnimationActive={false} // We handle animation via stepping
                            connectNulls={false}
                            dot={(props: any) => {
                                const { cx, cy, payload } = props;
                                if (!payload || payload.val === null) return <g key={`empty-${props.index}`}></g>;

                                if (payload.isEscalation) {
                                    return (
                                        <g key={`dot-${props.index}`}>
                                            <circle cx={cx} cy={cy} r={8} fill="var(--color-negative)" className="animate-in zoom-in duration-300" />
                                            <circle cx={cx} cy={cy} r={14} fill="var(--color-negative)" opacity={0.3} className="animate-ping" />
                                        </g>
                                    );
                                }
                                if (payload.isEmpathy) {
                                    return (
                                        <g key={`dot-${props.index}`}>
                                            <path d={`M${cx},${cy - 8} L${cx + 2},${cy - 2} L${cx + 8},${cy} L${cx + 2},${cy + 2} L${cx},${cy + 8} L${cx - 2},${cy + 2} L${cx - 8},${cy} L${cx - 2},${cy - 2} Z`} fill="var(--color-positive)" className="animate-in zoom-in duration-500" />
                                            <circle cx={cx} cy={cy} r={14} fill="var(--color-positive)" opacity={0.3} className="animate-pulse" />
                                        </g>
                                    );
                                }
                                return <circle key={`dot-${props.index}`} cx={cx} cy={cy} r={3} fill="var(--color-primary)" stroke="var(--color-background)" strokeWidth={2} />;
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                {/* Zero Line */}
                <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-text-muted/20 -translate-y-px pointer-events-none" />

                {/* Score overlay appearing at end */}
                {step >= 6 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px] animate-in fade-in duration-700">
                        <div className="flex flex-col items-center">
                            <div className="relative flex items-center justify-center w-20 h-20">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-card-border" />
                                    <circle cx="40" cy="40" r="36" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray={`${0.16 * 226} 226`} className="text-positive transition-all duration-1000 ease-out" />
                                </svg>
                                <span className="absolute text-xl font-bold font-mono">16%</span>
                            </div>
                            <span className="text-[10px] text-text-muted mt-2 uppercase tracking-widest font-bold">Empathy Score</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Mini Timeline */}
            <div className="space-y-3 pt-4 border-t border-card-border h-[260px] flex flex-col justify-end">
                {visibleMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.speaker === "A" ? "flex-row" : "flex-row-reverse"}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${msg.speaker === "A" ? "bg-primary" : "bg-[#34d399]"}`}>
                            {msg.speaker}
                        </div>
                        <div className={`flex flex-col ${msg.speaker === "A" ? "items-start" : "items-end"}`}>
                            <div className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] ${msg.speaker === "A" ? "bg-card border border-card-border/50 rounded-tl-sm" : "bg-primary/10 border border-primary/20 text-primary-light rounded-tr-sm"}`}>
                                {msg.text}
                            </div>
                            {msg.type === "escalation" && <span className="text-[9px] text-negative italic mt-1 px-1">Tension detected</span>}
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-xs text-center text-text-muted/60 italic pt-2">
                This is a sample conversation. The red dots show where tension peaked.
            </p>
        </div>
    );
}
