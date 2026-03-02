export default function ReflectionCard({ type, message, phrase, isLarge = false }: { type: string, message: string, phrase?: string, isLarge?: boolean }) {
    const borderStyle = type === "observation"
        ? "border-l-4 border-l-primary/60"
        : type === "trigger"
            ? "border-l-4 border-l-warning/70 bg-warning/5"
            : "border-l-4 border-l-positive/60";

    return (
        <div className={`glass-card hover:border-text-muted/30 transition-colors ${borderStyle} ${isLarge ? 'p-8' : 'p-6'}`}>
            <div className="space-y-2">
                <p className={`${isLarge ? 'text-lg' : 'text-base'} text-text-primary leading-relaxed`}>{message}</p>
                {phrase && (
                    <p className="text-sm text-text-muted italic mt-2">
                        "{phrase}"
                    </p>
                )}
            </div>
        </div>
    );
}
