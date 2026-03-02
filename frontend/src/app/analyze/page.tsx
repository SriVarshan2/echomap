"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmotionalMap from "@/components/EmotionalMap";
import ReflectionCard from "@/components/ReflectionCard";
import CrisisBanner from "@/components/CrisisBanner";
import EmpathyScore from "@/components/EmpathyScore";
import SpeakerLegend from "@/components/SpeakerLegend";
import ConversationTimeline from "@/components/ConversationTimeline";

export default function AnalyzePage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rewriteMessage, setRewriteMessage] = useState<string | null>(null);
    const [rewriteResult, setRewriteResult] = useState<any>(null);
    const [isRewriting, setIsRewriting] = useState(false);
    const [isComparing, setIsComparing] = useState(false);

    useEffect(() => {
        const input = sessionStorage.getItem("echomap_input");
        if (!input) {
            router.push("/");
            return;
        }

        const fetchData = async () => {
            try {
                // Ensure backend is reachable. Using /api prefix because of rewrites in next.config.ts
                const response = await fetch("/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: input,
                });

                if (!response.ok) throw new Error("Could not analyze this conversation.");

                const result = await response.json();
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                // Add a deliberate slight delay for "thoughtful" feeling as requested in Step 3
                setTimeout(() => setLoading(false), 2000);
            }
        };

        fetchData();
    }, [router]);

    const handleSuggestRewrite = async (message: string) => {
        setRewriteMessage(message);
        setIsRewriting(true);
        try {
            const res = await fetch("/api/rewrite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ original_message: message }),
            });
            const result = await res.json();
            setRewriteResult(result);
        } catch (err) {
            console.error("Rewrite failed", err);
        } finally {
            setIsRewriting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 animate-pulse" />
                <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-t-primary animate-spin" />
                <div className="absolute -inset-4 w-28 h-28 rounded-full border border-primary/10 animate-ping duration-1000" />
            </div>
            <div className="text-center space-y-2">
                <p className="text-lg font-medium text-text-primary animate-pulse">Mapping the emotional journey...</p>
                <p className="text-sm text-text-muted">Reading the emotional shape of this conversation...</p>
            </div>
        </div>
    );

    if (error || !data) return (
        <div className="text-center space-y-6 pt-20">
            <h2 className="text-2xl font-medium">Something went wrong.</h2>
            <p className="text-text-muted">{error || "Ensure the backend is running and try again."}</p>
            <button onClick={() => router.push("/")} className="btn-primary mx-auto">Go Back</button>
        </div>
    );

    const getSummarySentence = () => {
        const arc = data.summary.overall_arc;
        const domStr = ((data.summary.dominant_emotion_a || "") + " " + (data.summary.dominant_emotion_b || "")).toLowerCase();
        const hasTension = domStr.includes("frustrated") || domStr.includes("defensive");

        if (data.summary.empathy_score < 30) {
            return "This conversation felt difficult for both people.";
        }
        if (hasTension) {
            return "This conversation had moments of tension.";
        }
        if (data.summary.empathy_score > 60 && arc === "stable") {
            return "This was a largely supportive conversation.";
        }

        if (arc === "escalating") return "This conversation got harder as it went on.";
        if (arc === "de-escalating") return "Something shifted in this conversation. It got calmer.";

        const avgSentiment = data.messages.reduce((acc: number, m: any) => acc + m.sentiment_score, 0) / data.messages.length;
        if (avgSentiment >= 0) {
            return "This was a largely supportive conversation.";
        }
        return "This conversation stayed tense throughout.";
    };

    const handleShareInsight = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Background
        ctx.fillStyle = "#0a0a0a"; // EchoMap dark theme base
        ctx.fillRect(0, 0, 1080, 1080);

        // Logo / Branding
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "bold 48px Inter, system-ui, sans-serif";
        ctx.fillText("EchoMap", 80, 120);

        // Main Summary Sentence
        ctx.fillStyle = "#ffffff";
        ctx.font = "500 72px Inter, system-ui, sans-serif";
        const sentence = getSummarySentence();
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 10;
        ctx.fillText(sentence, 80, 300, 920);
        ctx.shadowBlur = 0;

        // Empathy Score
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "bold 120px Inter, system-ui, sans-serif";
        ctx.fillText(data.summary.empathy_score.toString(), 80, 520);

        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "32px Inter, system-ui, sans-serif";
        ctx.fillText("Empathy Score", 80, 570);

        // Draw a tiny representation of the emotion chart
        const startX = 80;
        const startY = 800;
        const chartWidth = 920;
        const chartHeight = 150;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        data.messages.forEach((m: any, idx: number) => {
            const x = startX + (idx / Math.max(1, data.messages.length - 1)) * chartWidth;
            // map sentiment_score (-1 to 1) to y coords
            const y = startY - (m.sentiment_score * (chartHeight / 2));
            ctx.lineTo(x, y);
        });
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 6;
        ctx.lineJoin = "round";
        ctx.stroke();

        // Footer
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "28px Inter, system-ui, sans-serif";
        ctx.fillText("Generated with EchoMap — echomap.app", 80, 1000);

        // Download
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = "echomap-insight.png";
        a.click();
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
            {/* Very Top Summary (Upgrade 2) */}
            <div className="text-center pt-2 pb-6 no-print">
                <h1 className="text-2xl md:text-3xl font-medium text-white/90 tracking-tight drop-shadow-sm">
                    {getSummarySentence()}
                </h1>
            </div>

            {/* Print Header */}
            <div className="print-only print-header">
                <div>
                    <h1 className="text-2xl font-bold">EchoMap — Reflection Report</h1>
                    <p className="text-sm">Analysis generated on {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-primary">Confidential</p>
                </div>
            </div>

            <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-medium">Here is what we noticed in this conversation.</h1>
                    <p className="text-text-muted">A reflection of the emotional dynamics observed.</p>
                </div>
                <div className="flex flex-col items-end gap-2 no-print shrink-0">
                    <span className="text-xs text-text-muted italic">Analyzed just now</span>
                    <div className="flex gap-3">
                        <button
                            onClick={handleShareInsight}
                            className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all border border-white/10 text-sm flex items-center gap-2"
                        >
                            <span>✨ Share what you found</span>
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                        >
                            <span>📥 Save this reflection</span>
                        </button>
                    </div>
                </div>
            </div>

            {data.summary.crisis_detected && <CrisisBanner />}

            {/* Main Stats Row */}
            <div className="flex flex-col md:flex-row gap-12">
                <div className="w-full md:w-[65%] space-y-6">
                    <div className="flex justify-between items-end">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">How the conversation moved</h2>
                        <SpeakerLegend
                            speakerA={data.messages[0]?.speaker || "Speaker A"}
                            speakerB={data.messages.find((m: any) => m.speaker !== data.messages[0]?.speaker)?.speaker || "Speaker B"}
                        />
                    </div>
                    <EmotionalMap data={data.messages} escalationPoints={data.summary.escalation_points} />
                </div>

                <div className="w-full md:w-[35%] space-y-8 mt-0 md:mt-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">What stood out</h2>
                    <EmpathyScore score={data.summary.empathy_score} />

                    <div className="glass-card space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-text-muted">Where it went</span>
                            <span className="text-primary font-mono capitalize">{data.summary.overall_arc}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-text-muted">Who was carrying the conversation</span>
                            <span className="text-primary font-mono">{data.summary.balance_score}%</span>
                        </div>
                        <p className="text-[10px] text-text-muted italic leading-relaxed pt-2 border-t border-card-border">
                            The overall feeling: <br />
                            {data.summary.dominant_emotion_a} & {data.summary.dominant_emotion_b}
                        </p>
                    </div>
                </div>
            </div>

            {/* Humanized Reflections Layout */}
            <div className="space-y-6 pt-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">What we noticed</h2>

                <div className="flex flex-col gap-6">
                    {/* Row 1: First item full width */}
                    {data.reflections.length > 0 && (
                        <div className="w-full">
                            <ReflectionCard {...data.reflections[0]} isLarge={true} />
                        </div>
                    )}

                    {/* Row 2: Items 2 and 3 split 55/45 */}
                    {(data.reflections.length > 1) && (
                        <div className="flex flex-col md:flex-row gap-6 w-full">
                            <div className="w-full md:w-[55%]">
                                <ReflectionCard {...data.reflections[1]} />
                            </div>
                            {data.reflections.length > 2 && (
                                <div className="w-full md:w-[45%]">
                                    <ReflectionCard {...data.reflections[2]} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Row 3+: Remaining items full width */}
                    {data.reflections.length > 3 && data.reflections.slice(3).map((ref: any, i: number) => (
                        <div key={`extra-${i}`} className="w-full">
                            <ReflectionCard {...ref} />
                        </div>
                    ))}
                </div>

                {/* Tiny muted legend */}
                <div className="flex justify-end gap-4 text-[10px] text-text-muted/60 lowercase pt-2 font-mono">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-primary rounded-sm opacity-50" /> observation</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-warning rounded-sm opacity-50" /> tension point</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-positive rounded-sm opacity-50" /> empathy moment</span>
                </div>
            </div>

            <div className="pt-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6">Message Timeline</h2>
                <ConversationTimeline
                    messages={data.messages}
                    onSuggestRewrite={handleSuggestRewrite}
                />
            </div>

            {/* Rewrite Modal (Feature 3 Overlay) */}
            {rewriteMessage && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="glass-card max-w-lg w-full space-y-6 shadow-2xl border-primary/20">
                        <div className="flex justify-between items-center border-b border-card-border pb-4">
                            <h3 className="font-bold text-lg text-primary">Rewrite Assistant</h3>
                            <button onClick={() => { setRewriteMessage(null); setRewriteResult(null); }} className="text-text-muted hover:text-text-primary">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Original Message</p>
                                <p className="text-sm italic text-text-primary">"{rewriteMessage}"</p>
                            </div>

                            {isRewriting ? (
                                <div className="py-8 flex flex-col items-center justify-center gap-4">
                                    <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                    <p className="text-xs text-text-muted">Generating calmer perspective...</p>
                                </div>
                            ) : rewriteResult ? (
                                <div className="space-y-6 animate-in slide-in-from-bottom-2">
                                    <div className="p-4 bg-positive/5 border border-positive/20 rounded-lg space-y-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-positive">Suggested Version</p>
                                        <p className="text-md font-medium text-text-primary">"{rewriteResult.suggestion}"</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Why this works</p>
                                        <p className="text-xs text-text-muted leading-relaxed">{rewriteResult.explanation}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(rewriteResult.suggestion);
                                            alert("Copied to clipboard!");
                                        }}
                                        className="btn-primary w-full py-2 text-sm"
                                    >
                                        Copy to Clipboard
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}

            {/* Comparison Mode (Upgrade 5 / Demo Script Feature) */}
            <div className="pt-8 border-t border-card-border no-print">
                {!isComparing ? (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsComparing(true)}
                            className="bg-primary/10 hover:bg-primary/20 text-primary font-medium px-6 py-3 rounded-lg transition-all flex items-center gap-2"
                        >
                            <span>⚖️ Compare two conversations</span>
                        </button>
                    </div>
                ) : (
                    <div className="glass-card space-y-6 animate-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center border-b border-card-border pb-4">
                            <h2 className="text-lg font-bold text-primary">Comparison Mode: Before & After</h2>
                            <button onClick={() => setIsComparing(false)} className="text-text-muted hover:text-text-primary text-sm">✕ Close</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted">Conversation 2 (Follow-up)</h3>
                                <textarea
                                    className="input-field w-full h-32 text-sm font-mono resize-none opacity-50 cursor-not-allowed"
                                    disabled
                                    value={"Person A: I thought about what we said yesterday.\nPerson B: Me too. I'm sorry I got defensive.\nPerson A: Thanks for saying that. I appreciate it."}
                                />
                                <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed">Analysis Complete</button>
                            </div>
                            <div className="space-y-4 flex flex-col justify-center">
                                <div className="p-6 bg-positive/10 border border-positive/20 rounded-xl space-y-2">
                                    <h3 className="text-positive font-bold flex items-center gap-2"><span>📈</span> Progress Detected</h3>
                                    <p className="text-sm text-text-primary leading-relaxed">
                                        This is before and after. Same two people, different week.
                                    </p>
                                    <ul className="text-sm text-text-muted space-y-1 list-disc list-inside pt-2">
                                        <li>Conversation 2 showed 34% lower emotional intensity.</li>
                                        <li>The empathy score went up <strong className="text-positive">22 points</strong>.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center pt-8 no-print">
                <button onClick={() => router.push("/")} className="text-sm text-text-muted hover:text-text-primary underline decoration-primary/30 underline-offset-4">
                    Start a new analysis
                </button>
            </div>
        </div>
    );
}
