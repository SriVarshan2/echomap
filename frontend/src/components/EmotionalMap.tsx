"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea,
    ReferenceLine
} from "recharts";

interface Message {
    id: number;
    speaker: string;
    sentiment_score: number;
    intensity: number;
    text: string;
    is_escalation_point?: boolean;
}

interface EmotionalMapProps {
    data: Message[];
    escalationPoints: number[];
}

export default function EmotionalMap({ data, escalationPoints }: EmotionalMapProps) {
    const speakerA = data.length > 0 ? data[0].speaker : "Speaker A";
    const speakerB = data.find((m: any) => m.speaker !== speakerA)?.speaker || "Speaker B";

    const personAData = data
        .filter(m => m.speaker === speakerA)
        .map((m, i) => ({ index: i + 1, score: m.sentiment_score, original: m }));

    const personBData = data
        .filter(m => m.speaker === speakerB)
        .map((m, i) => ({ index: i + 1, score: m.sentiment_score, original: m }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const msg = payload[0].payload.original;
            return (
                <div className="glass-card p-3 max-w-xs text-xs space-y-2 border-primary/30">
                    <p className="font-mono text-primary">{msg.speaker}</p>
                    <p className="text-text-primary italic">"{msg.text.substring(0, 100)}{msg.text.length > 100 ? "..." : ""}"</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-[400px] glass-card p-4 overflow-hidden space-y-2">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3a" vertical={false} />
                    <XAxis
                        dataKey="index"
                        type="category"
                        allowDuplicatedCategory={false}
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        label={{ value: 'Message', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10 }}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[-1, 1]}
                        ticks={[-1, -0.5, 0, 0.5, 1]}
                        tickFormatter={(val) => {
                            if (val === 1) return "calm";
                            if (val === -1) return "tense";
                            return "";
                        }}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    <ReferenceLine y={0} stroke="#2a2a3a" strokeDasharray="4 4" label={{ position: 'insideLeft', value: 'neutral', fill: '#64748b', fontSize: 10 }} />

                    {/* Highlight escalation areas if needed */}
                    {escalationPoints.map((idx) => (
                        <ReferenceArea
                            key={idx}
                            x1={idx - 0.5}
                            x2={idx + 0.5}
                            fill="#f87171"
                            fillOpacity={0.05}
                        />
                    ))}

                    <Area
                        type="monotone"
                        data={personAData}
                        dataKey="score"
                        stroke="#7c6af7"
                        fill="#7c6af7"
                        fillOpacity={0.2}
                        strokeWidth={3}
                        name={speakerA}
                        isAnimationActive={true}
                        animationDuration={2000}
                        dot={(props: any) => {
                            const { cx, cy, payload } = props;
                            if (payload.original.is_escalation_point) {
                                return (
                                    <g key={`dot-a-${payload.index}`}>
                                        <title>Tension point</title>
                                        <circle cx={cx} cy={cy} r={8} fill="#f87171" />
                                    </g>
                                );
                            }
                            return <circle cx={cx} cy={cy} r={4} fill="#7c6af7" strokeWidth={0} key={`dot-a-${payload.index}`} />;
                        }}
                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                    <Area
                        type="monotone"
                        data={personBData}
                        dataKey="score"
                        stroke="#34d399"
                        fill="#34d399"
                        fillOpacity={0.2}
                        strokeWidth={3}
                        name={speakerB}
                        isAnimationActive={true}
                        animationDuration={2000}
                        dot={(props: any) => {
                            const { cx, cy, payload } = props;
                            if (payload.original.is_escalation_point) {
                                return (
                                    <g key={`dot-b-${payload.index}`}>
                                        <title>Tension point</title>
                                        <circle cx={cx} cy={cy} r={8} fill="#f87171" />
                                    </g>
                                );
                            }
                            return <circle cx={cx} cy={cy} r={4} fill="#34d399" strokeWidth={0} key={`dot-b-${payload.index}`} />;
                        }}
                        activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-text-muted italic pt-1 pl-4 text-center">
                Tip: The moments just before a red dot often hold the key to what shifted.
            </p>
        </div>
    );
}
