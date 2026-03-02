export default function SpeakerLegend({ speakerA, speakerB }: { speakerA: string, speakerB: string }) {
    return (
        <div className="flex gap-6 justify-center text-xs font-mono text-text-muted">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span>{speakerA} (Overall Journey)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-primary/50" />
                <span>{speakerB}</span>
            </div>
        </div>
    );
}
