// path: src/components/tools/sop-library.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { trackDownload } from "@/app/actions/asset";

// ─── SOP Template Data ───────────────────────────────────────────────
const SOP_TEMPLATES = [
    {
        id: "family-visa",
        title: "Family-Based Visa SOP",
        description: "Step-by-step workflow for I-130 and consular processing cases.",
        icon: "👨‍👩‍👧‍👦",
        pages: 12,
    },
    {
        id: "asylum",
        title: "Asylum Application SOP",
        description: "Complete procedure for defensive and affirmative asylum filings.",
        icon: "🛡️",
        pages: 18,
    },
    {
        id: "h1b",
        title: "H-1B Petition SOP",
        description: "End-to-end H-1B sponsorship process including RFE responses.",
        icon: "💼",
        pages: 15,
    },
    {
        id: "naturalization",
        title: "Naturalization SOP",
        description: "N-400 preparation, interview coaching, and oath ceremony guide.",
        icon: "🏛️",
        pages: 10,
    },
    {
        id: "removal-defense",
        title: "Removal Defense SOP",
        description: "Strategy checklists for cancellation of removal and 42B waivers.",
        icon: "⚖️",
        pages: 22,
    },
] as const;

const ASSET_ID = "sop-bundle-2024";

interface SopLibraryProps {
    hasDownloaded: boolean;
    ownerType: "user" | "guest";
}

export default function SopLibrary({
    hasDownloaded: initialHasDownloaded,
    ownerType,
}: SopLibraryProps) {
    const [isPending, startTransition] = useTransition();
    const [hasDownloaded, setHasDownloaded] = useState(initialHasDownloaded);
    const [showModal, setShowModal] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    function handleDownload() {
        startTransition(async () => {
            const result = await trackDownload({ assetId: ASSET_ID });

            if (!result.success) {
                console.error("[SopLibrary] Download tracking failed:", result.error);
                return;
            }

            setHasDownloaded(true);
            setDownloadUrl(result.data.downloadUrl);

            // Show post-value capture modal for guests
            if (result.data.owner.type === "guest") {
                setShowModal(true);
            }
        });
    }

    const isGuest = ownerType === "guest";
    const buttonLabel = hasDownloaded
        ? "Download Again"
        : isGuest
            ? "Get Free Access"
            : "Download All SOPs";

    return (
        <div className="space-y-6">
            {/* Already downloaded badge for users */}
            {hasDownloaded && !isGuest && (
                <div className="bg-emerald-900/40 border border-emerald-700/40 rounded-xl px-5 py-3 flex items-center gap-3">
                    <span className="text-emerald-400 text-lg">✓</span>
                    <p className="text-sm text-emerald-300 font-medium">
                        Download recorded to your Dashboard
                    </p>
                </div>
            )}

            {/* SOP Cards Grid */}
            <div className="grid gap-4">
                {SOP_TEMPLATES.map((sop) => (
                    <div
                        key={sop.id}
                        className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 backdrop-blur-sm flex items-start gap-4 hover:border-zinc-700/60 transition-colors"
                    >
                        <div className="shrink-0 h-11 w-11 rounded-lg bg-zinc-800/80 border border-zinc-700/40 flex items-center justify-center text-xl">
                            {sop.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold text-zinc-200">
                                {sop.title}
                            </h3>
                            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                                {sop.description}
                            </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-zinc-800/50 border border-zinc-700/40 px-2.5 py-1 text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                            {sop.pages} pgs
                        </span>
                    </div>
                ))}
            </div>

            {/* Download CTA */}
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-sm text-center space-y-4">
                <div>
                    <p className="text-2xl font-bold text-zinc-100">
                        5 SOPs · 77 Pages
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">
                        Production-ready templates used by 200+ immigration law
                        firms
                    </p>
                </div>

                <button
                    onClick={handleDownload}
                    disabled={isPending}
                    className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <Spinner />
                            Processing…
                        </span>
                    ) : (
                        buttonLabel
                    )}
                </button>

                {/* Show direct download link after access granted */}
                {hasDownloaded && downloadUrl && !showModal && (
                    <a
                        href={downloadUrl}
                        className="inline-block text-sm text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
                    >
                        ↓ Direct download link
                    </a>
                )}
            </div>

            {/* Post-Value Capture Modal (Guest) */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-zinc-900 border border-zinc-700/60 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-5">
                        <div className="text-center space-y-3">
                            <p className="text-3xl">🎉</p>
                            <h2 className="text-xl font-bold text-zinc-100">
                                Your download is ready!
                            </h2>
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Create a free account to get{" "}
                                <span className="text-indigo-400 font-semibold">
                                    5 more premium templates
                                </span>{" "}
                                next week — plus save all your audit data
                                permanently.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/auth/signin"
                                className="block w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white text-center shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                            >
                                Create Free Account
                            </Link>
                            <button
                                onClick={() => setShowModal(false)}
                                className="block w-full rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-400 text-center hover:bg-zinc-800/50 hover:border-zinc-600 transition-all"
                            >
                                Maybe Later
                            </button>
                        </div>

                        {downloadUrl && (
                            <p className="text-center">
                                <a
                                    href={downloadUrl}
                                    className="text-xs text-zinc-500 hover:text-zinc-400 underline underline-offset-4 transition-colors"
                                >
                                    ↓ Download without signing up
                                </a>
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Sub-components ──────────────────────────────────────────────────

function Spinner() {
    return (
        <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
        </svg>
    );
}
