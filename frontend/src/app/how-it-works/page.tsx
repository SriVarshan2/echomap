export default function HowItWorks() {
    return (
        <div className="max-w-2xl mx-auto space-y-12 py-10 animate-in fade-in duration-700">
            <div className="space-y-4 text-center">
                <h1 className="text-4xl font-semibold">How EchoMap Works</h1>
                <p className="text-text-muted italic leading-relaxed">
                    "Transparency is the foundation of trust."
                </p>
            </div>

            <section className="space-y-6">
                <h2 className="text-xl font-medium">Privacy by design</h2>
                <div className="glass-card space-y-4">
                    <p className="text-sm leading-relaxed">
                        EchoMap is built with a strictly stateless architecture. When you paste a conversation,
                        the text is sent to our analyzer, processed in memory, and the results are sent
                        back to your screen.
                    </p>
                    <div className="p-4 bg-background/50 rounded-lg border border-card-border space-y-2">
                        <h3 className="text-xs font-bold uppercase text-primary">Technical Commitment:</h3>
                        <ul className="text-xs space-y-1 text-text-muted list-disc ml-4">
                            <li>No database storage</li>
                            <li>No logging of conversation content</li>
                            <li>No tracking pixels or third-party behavioral analytics</li>
                            <li>No account required, ever.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-medium">Behind the analysis</h2>
                <div className="glass-card space-y-4">
                    <p className="text-sm leading-relaxed">
                        We use <span className="text-primary font-mono">VADER</span> (Valence Aware Dictionary and sEntiment Reasoner),
                        a rule-based sentiment analysis tool specifically tuned for social and conversational language.
                    </p>
                    <p className="text-sm leading-relaxed">
                        EchoMap looks for patterns, not just words. It detects "trigger phrases" that commonly lead
                        to defensiveness and "empathy markers" that help de-escalate tension. It maps these
                        on a timeline to help you see the "emotional arc" of your interaction.
                    </p>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-xl font-medium">Important Disclaimer</h2>
                <div className="p-6 bg-warning/5 border border-warning/20 rounded-xl space-y-3">
                    <p className="text-sm text-text-primary leading-relaxed italic">
                        EchoMap is a reflection tool, not a clinical diagnostic instrument. It cannot
                        understand the deep context of your life or relationships. If you are experiencing
                        significant emotional distress or relationship conflict, please consult a
                        qualified professional.
                    </p>
                </div>
            </section>

            <footer className="text-center pt-10">
                <a href="/" className="btn-primary inline-flex">Back to EchoMap</a>
            </footer>
        </div>
    );
}
