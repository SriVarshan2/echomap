"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();
  const [conversation, setConversation] = useState("");
  const [speakerA, setSpeakerA] = useState("");
  const [speakerB, setSpeakerB] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("echomap_input");

    if (!stored) {
      router.push("/");
      return;
    }

    const parsed = JSON.parse(stored);
    setConversation(parsed.conversation);
    setSpeakerA(parsed.speaker_a);
    setSpeakerB(parsed.speaker_b);

    analyzeConversation(parsed.conversation);
  }, []);
  useEffect(() => {
  fetch("https://your-backend-url.onrender.com/api/test")
    .then(res => res.json())
    .then(data => console.log(data));
}, []);

  const analyzeConversation = async (text: string) => {
    try {
      const response = await fetch(
        "https://echomap-1.onrender.com/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        🔍 Analyzing conversation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="btn-primary px-6 py-2"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16 max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Conversation Analysis</h1>

      <div className="bg-card p-6 rounded-xl border border-card-border">
        <h2 className="font-semibold mb-2">Original Conversation</h2>
        <pre className="whitespace-pre-wrap text-sm text-text-muted">
          {conversation}
        </pre>
      </div>

      <div className="bg-card p-6 rounded-xl border border-card-border">
        <h2 className="font-semibold mb-2">Analysis Result</h2>

        {result ? (
          <div className="space-y-2">
            <p>
              <strong>Sentiment:</strong> {result.sentiment}
            </p>
            {result.original_text && (
              <p>
                <strong>Text:</strong> {result.original_text}
              </p>
            )}
          </div>
        ) : (
          <p>No result returned.</p>
        )}
      </div>
      

      <button
        onClick={() => router.push("/")}
        className="btn-primary px-6 py-3"
      >
        Analyze Another Conversation
      </button>
    </div>
  );
}