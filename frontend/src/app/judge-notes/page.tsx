export default function JudgeNotesPage() {
    return (
        <div className="max-w-3xl mx-auto pt-16 space-y-12 animate-in fade-in duration-500 pb-20">
            <div className="space-y-4 border-b border-card-border pb-8">
                <h1 className="text-3xl font-bold uppercase tracking-widest text-primary">Live Demo Script</h1>
                <p className="text-text-muted">Hidden route for presentation only. Do not navigate here during the pitch.</p>
            </div>

            <div className="space-y-10">
                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">Step 1 — Open /demo</h2>
                    <div className="p-6 glass-card border-l-4 border-l-primary space-y-2">
                        <p className="font-mono text-sm text-primary">Action: Navigate to localhost:3000/demo (It auto-loads and submits the sample conversation).</p>
                        <p className="text-xl font-medium text-white italic">"This is a conversation between two people during a disagreement. Watch what happens."</p>
                    </div>
                </section>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">Step 2 — Point to the chart</h2>
                    <div className="p-6 glass-card border-l-4 border-l-primary space-y-2">
                        <p className="font-mono text-sm text-primary">Action: Gesture towards the Emotional Map's escalation points.</p>
                        <p className="text-xl font-medium text-white italic">"Each line is one person. Red dots are the moments emotional intensity spiked. You can see exactly where it started breaking down."</p>
                    </div>
                </section>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">Step 3 — Click a trigger phrase reflection card</h2>
                    <div className="p-6 glass-card border-l-4 border-l-primary space-y-2">
                        <p className="font-mono text-sm text-primary">Action: Click "Suggest calmer version" on the timeline or point to the reflection cards.</p>
                        <p className="text-xl font-medium text-white italic">"EchoMap noticed this phrase appeared 3 times. It suggests a calmer alternative — no blame, just a reframe."</p>
                    </div>
                </section>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">Step 4 — Show crisis banner</h2>
                    <div className="p-6 glass-card border-l-4 border-l-primary space-y-2">
                        <p className="font-mono text-sm text-primary">Action: Point to the (simulated or real) crisis banner if present.</p>
                        <p className="text-xl font-medium text-white italic">"If the system detects language associated with distress, it shows this — gently, with resources. Never alarming. Never automatic."</p>
                    </div>
                </section>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-text-muted">Step 5 — Show comparison mode</h2>
                    <div className="p-6 glass-card border-l-4 border-l-primary space-y-2">
                        <p className="font-mono text-sm text-primary">Action: Toggle the 'Compare two conversations' button (simulated feature).</p>
                        <p className="text-xl font-medium text-white italic">"This is before and after. Same two people, different week. The empathy score went up 22 points."</p>
                    </div>
                </section>

                <section className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-positive">Step 6 — The Close</h2>
                    <div className="p-8 bg-primary/10 border border-primary/30 rounded-xl space-y-4">
                        <p className="font-mono text-sm text-primary">Action: Look directly at the judges. Do not look at the screen.</p>
                        <p className="text-2xl font-bold text-white leading-relaxed">
                            "We did not build a judge. We built a mirror.<br />
                            The hardest part of communication is seeing what you cannot see in the moment.<br />
                            EchoMap gives you that moment back."
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
