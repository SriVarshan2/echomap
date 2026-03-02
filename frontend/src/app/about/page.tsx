import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="max-w-2xl mx-auto pt-20 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight">The Story Behind EchoMap</h1>

                <div className="prose prose-invert prose-lg text-text-primary leading-relaxed space-y-6">
                    <p>
                        I built EchoMap after realizing that most of my hardest conversations followed the same pattern — tension building slowly until something broke.
                    </p>
                    <p>
                        I wanted to see that pattern.
                    </p>
                    <p>
                        EchoMap is not a therapist. It is not a judge. It is a mirror — one that shows you the emotional shape of words you have already said, so you can decide what to say next.
                    </p>
                </div>
            </div>

            <div className="pt-10 border-t border-card-border">
                <Link href="/" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    &larr; Back to the mirror
                </Link>
            </div>
        </div>
    );
}
