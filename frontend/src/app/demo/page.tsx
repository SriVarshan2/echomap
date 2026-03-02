"use client";
import { useEffect } from "react";
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

export default function DemoPage() {
    const router = useRouter();

    useEffect(() => {
        sessionStorage.setItem("echomap_input", JSON.stringify({
            conversation: DEMO_CONVERSATION,
            speaker_a: "Person A",
            speaker_b: "Person B"
        }));
        router.push("/analyze");
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in fade-in duration-500">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-text-muted animate-pulse tracking-widest uppercase text-sm font-bold">Initializing Live Demo...</p>
        </div>
    );
}
