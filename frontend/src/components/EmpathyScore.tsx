export default function EmpathyScore({ score }: { score: number }) {
    return (
        <div className="glass-card text-center space-y-4 flex flex-col items-center justify-center">
            <p className="text-xs uppercase tracking-widest text-text-muted">Moments of understanding</p>
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r="44"
                        className="stroke-card-border fill-none"
                        strokeWidth="8"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r="44"
                        className="stroke-positive fill-none transition-all duration-1000 ease-out"
                        strokeWidth="8"
                        strokeDasharray={276}
                        strokeDashoffset={276 - (276 * score) / 100}
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute text-2xl font-mono text-text-primary">{score}%</span>
            </div>
            <p className="text-[10px] text-text-muted italic max-w-[150px]">
                {score < 20 && "Very few moments of acknowledgment were detected."}
                {score >= 20 && score < 40 && "Some acknowledgment appeared but tension was stronger."}
                {score >= 40 && score <= 60 && "A mix of understanding and defensiveness."}
                {score > 60 && "Strong signals of listening and acknowledgment."}
            </p>
        </div>
    );
}
