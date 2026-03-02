import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "EchoMap — See the emotional shape of any conversation",
    description: "A privacy-first tool to understand conversation dynamics and improve communication.",
    icons: {
        icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='none' stroke='%237c6af7' stroke-width='8'/><path d='M30,50 Q40,30 50,50 T70,50' fill='none' stroke='%237c6af7' stroke-width='6' stroke-linecap='round'/></svg>"
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-background text-text-primary px-6">
                <header className="max-w-5xl mx-auto py-8 flex justify-between items-center relative z-20">
                    <Link href="/" className="flex items-center gap-2 text-xl font-medium group">
                        <span className="w-6 h-6 rounded-full border-4 border-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </span>
                        <span>EchoMap</span>
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link href="/about" className="text-sm text-text-muted hover:text-text-primary transition-colors">
                            About
                        </Link>
                        <Link href="/demo" className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-colors">
                            Try Demo
                        </Link>
                    </nav>
                </header>
                <main className="max-w-5xl mx-auto pb-20">
                    {children}
                </main>
            </body>
        </html>
    );
}
