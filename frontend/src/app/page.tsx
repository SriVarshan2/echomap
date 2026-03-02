import ConversationInput from "@/components/ConversationInput";

export default function LandingPage() {
  return (
    <div className="space-y-24 pt-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-text-primary animate-in fade-in slide-in-from-bottom-4 duration-1000">
            See the emotional shape of any conversation.
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            EchoMap uses AI to help you understand the dynamics of your communication, identifying tension points and empathy moments. No logs, no storage, just reflection.
          </p>
        </div>
      </section>

      {/* Core Interaction */}
      <section id="analyze" className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <ConversationInput />
      </section>

      {/* Evidence/Value Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 pb-24 border-t border-card-border animate-in fade-in duration-1000 delay-700">
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
          <h3 className="font-semibold text-lg">Identify Triggers</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Find the exact phrases that shifted the tone from productive to defensive.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
          <h3 className="font-semibold text-lg">Measure Empathy</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Visualize how well both speakers are listening and validating each other.
          </p>
        </div>
        <div className="space-y-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
          <h3 className="font-semibold text-lg">Rewrite Path</h3>
          <p className="text-text-muted text-sm leading-relaxed">
            Get AI suggestions on how to rephrase tense moments to be more constructive.
          </p>
        </div>
      </section>
    </div>
  );
}