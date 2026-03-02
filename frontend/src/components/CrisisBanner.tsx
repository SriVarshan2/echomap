export default function CrisisBanner() {
    return (
        <div className="p-6 bg-warning/10 border border-warning/30 rounded-xl space-y-3 animate-pulse">
            <div className="flex items-center gap-2 text-warning font-medium">
                <span>⚠️ Sensitive Content Noticed</span>
            </div>
            <p className="text-sm text-text-primary leading-relaxed">
                Some parts of this conversation may be intense. If you or someone you know is in
                distress, please consider reaching out to a professional or a support line.
                EchoMap is a reflection tool and not a crisis intervention service.
            </p>
        </div>
    );
}
