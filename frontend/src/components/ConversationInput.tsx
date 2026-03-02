"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DEMO_CONVERSATION = `Person A: I just feel like you never actually listen to me.
Person B: That's not fair. I always try to be there for you.
Person A: Trying isn't the same as actually doing it.
Person B: I don't know what you want from me anymore.
Person A: I want you to hear me without getting defensive.
Person B: I'm not being defensive. You're being too sensitive.
Person A: See, that's exactly what I mean.
Person B: Fine. I'm sorry. What do you want me to say?
Person A: I just wanted to feel understood. That's all.
Person B: I do understand. I just don't always show it right.
Person A: That actually means a lot to hear. Thank you.
Person B: I don't want to keep fighting like this either.`;

export default function ConversationInput() {
  const router = useRouter();
  const [speakerA, setSpeakerA] = useState("Person A");
  const [speakerB, setSpeakerB] = useState("Person B");
  const [conversation, setConversation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // Keyboard shortcut Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        handleAnalyze();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [conversation]);

  const handleDemo = () => {
    setSpeakerA("Person A");
    setSpeakerB("Person B");
    setConversation(DEMO_CONVERSATION);
    setIsDemo(true);
  };

  const handleAnalyze = async () => {
    if (!conversation.trim()) return;

    setIsLoading(true);
    try {
      sessionStorage.setItem("echomap_input", JSON.stringify({
        conversation,
        speaker_a: speakerA,
        speaker_b: speakerB
      }));

      router.push("/analyze");
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {isDemo && (
        <div className="bg-warning/20 border border-warning/30 text-warning text-xs font-medium px-3 py-1.5 rounded-full w-fit animate-pulse">
          Demo Mode — sample conversation only
        </div>
      )}

      <div className="flex justify-between items-end">
        <div className="space-y-4 flex-1">
          <label className="text-sm font-medium text-text-muted">Step 1 — Speaker Labels (optional)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Person A name"
              className="input-field"
              value={speakerA}
              onChange={(e) => setSpeakerA(e.target.value)}
            />
            <input
              type="text"
              placeholder="Person B name"
              className="input-field"
              value={speakerB}
              onChange={(e) => setSpeakerB(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-text-muted">Step 2 — Conversation paste area</label>
          <button
            onClick={handleDemo}
            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1 rounded-md"
          >
            ◎ Try a Demo Conversation
          </button>
        </div>
        <textarea
          placeholder={`Paste your conversation here.\n\nFormat example:\n${speakerA}: I just feel like you never listen to me.\n${speakerB}: That's not fair, I always try to be there.\n${speakerA}: It doesn't feel that way lately.\n\nEach line should start with the speaker name followed by a colon.`}
          className="input-field w-full min-h-[300px] font-mono text-sm leading-relaxed resize-none"
          value={conversation}
          onChange={(e) => {
            setConversation(e.target.value);
            if (isDemo) setIsDemo(false);
          }}
        />
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-text-muted italic">Each line should start with the speaker name followed by a colon.</p>
          <p className="text-[10px] text-text-muted font-mono">Ctrl+Enter to analyze</p>
        </div>
      </div>

      <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-primary font-medium">
          <span>🔒 Your privacy is protected</span>
        </div>
        <p className="text-sm text-text-muted leading-relaxed">
          EchoMap does not store, share, or log any conversation text. Analysis happens
          in real time and is discarded immediately. No account required. No tracking.
        </p>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={isLoading || !conversation.trim()}
        className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <span>{isLoading ? "Analyzing..." : "◎ Analyze Conversation"}</span>
      </button>

      <p className="text-center text-xs text-text-muted">
        Analysis takes 2–4 seconds. <br />
        This is not therapy or diagnosis. It is a reflection tool.
      </p>
    </div>
  );
}
