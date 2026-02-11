// path: src/components/tools/ai-checklist.tsx
"use client";

import { useState, useOptimistic, useTransition } from "react";
import Link from "next/link";
import { toggleItem } from "@/app/actions/checklist";

// ─── 20-point AI Adoption Checklist ──────────────────────────────────
const CHECKLIST_ITEMS = [
    { id: "audit-docs", label: "Audit current document workflow" },
    { id: "id-repetitive", label: "Identify repetitive tasks across cases" },
    { id: "map-bottlenecks", label: "Map case processing bottlenecks" },
    { id: "eval-ai-tools", label: "Evaluate AI-powered legal tools on the market" },
    { id: "data-inventory", label: "Inventory existing digital and paper records" },
    { id: "security-review", label: "Review data security and compliance requirements" },
    { id: "staff-survey", label: "Survey staff on pain points and time sinks" },
    { id: "pilot-scope", label: "Define scope for an AI pilot program" },
    { id: "budget-estimate", label: "Estimate budget for AI tool adoption" },
    { id: "vendor-shortlist", label: "Shortlist 3-5 AI solution vendors" },
    { id: "roi-model", label: "Build an ROI projection model" },
    { id: "training-plan", label: "Draft a staff training plan" },
    { id: "integration-check", label: "Check integration with existing case management" },
    { id: "ethics-guidelines", label: "Establish AI ethics and usage guidelines" },
    { id: "client-comm", label: "Plan client communication about AI adoption" },
    { id: "pilot-launch", label: "Launch pilot with one practice area" },
    { id: "metrics-tracking", label: "Set up metrics and KPI tracking" },
    { id: "feedback-loop", label: "Create a feedback loop with pilot users" },
    { id: "iterate-refine", label: "Iterate and refine based on pilot results" },
    { id: "full-rollout", label: "Plan full rollout timeline and milestones" },
] as const;

const TOTAL = CHECKLIST_ITEMS.length;
const GUEST_CTA_THRESHOLD = 3;

interface AiChecklistProps {
    initialCompleted: string[];
    ownerType: "user" | "guest";
}

export default function AiChecklist({
    initialCompleted,
    ownerType,
}: AiChecklistProps) {
    const [isPending, startTransition] = useTransition();
    const [showBanner, setShowBanner] = useState(false);
    const [dismissedBanner, setDismissedBanner] = useState(false);

    // Optimistic state for instant checkbox feedback
    const [optimisticCompleted, addOptimistic] = useOptimistic(
        initialCompleted,
        (state: string[], update: { itemId: string; isChecked: boolean }) => {
            if (update.isChecked) {
                return state.includes(update.itemId) ? state : [...state, update.itemId];
            }
            return state.filter((id) => id !== update.itemId);
        }
    );

    const completedCount = optimisticCompleted.length;
    const progressPct = Math.round((completedCount / TOTAL) * 100);

    function handleToggle(itemId: string, isChecked: boolean) {
        startTransition(async () => {
            addOptimistic({ itemId, isChecked });
            const result = await toggleItem({ itemId, isChecked });

            // Show guest CTA after threshold
            if (
                result.success &&
                result.data.owner.type === "guest" &&
                result.data.completedItems.length > GUEST_CTA_THRESHOLD &&
                !dismissedBanner
            ) {
                setShowBanner(true);
            }
        });
    }

    return (
        <div className="space-y-6">
            {/* Guest CTA Banner */}
            {showBanner && !dismissedBanner && (
                <div className="sticky top-0 z-50 bg-amber-900/80 border border-amber-700/50 backdrop-blur-md rounded-xl px-6 py-4 flex items-center justify-between gap-4 animate-in">
                    <div>
                        <p className="text-sm font-semibold text-amber-200">
                            Your progress is temporary!
                        </p>
                        <p className="text-xs text-amber-300/70 mt-0.5">
                            Sign in to save your checklist progress permanently.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Link
                            href="/auth/signin"
                            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors"
                        >
                            Sign In to Save →
                        </Link>
                        <button
                            onClick={() => setDismissedBanner(true)}
                            className="rounded-lg border border-amber-700/50 px-2 py-2 text-xs text-amber-300 hover:bg-amber-800/50 transition-colors"
                            aria-label="Dismiss banner"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* User saved badge */}
            {ownerType === "user" && (
                <div className="bg-emerald-900/40 border border-emerald-700/40 rounded-xl px-5 py-3 flex items-center gap-3">
                    <span className="text-emerald-400 text-lg">✓</span>
                    <p className="text-sm text-emerald-300 font-medium">
                        Progress auto-saved to your Dashboard
                    </p>
                </div>
            )}

            {/* Progress Bar Card */}
            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-end justify-between mb-3">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-1">
                            Progress
                        </p>
                        <p className="text-2xl font-bold text-zinc-100">
                            {completedCount}
                            <span className="text-zinc-500 text-lg font-medium">/{TOTAL}</span>
                        </p>
                    </div>
                    <p className="text-sm font-semibold text-indigo-400">
                        {progressPct}%
                    </p>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>

            {/* Checklist Items */}
            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl divide-y divide-zinc-800/50 backdrop-blur-sm overflow-hidden">
                {CHECKLIST_ITEMS.map((item, index) => {
                    const isChecked = optimisticCompleted.includes(item.id);

                    return (
                        <label
                            key={item.id}
                            className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-zinc-800/30 ${isChecked ? "bg-zinc-800/20" : ""
                                }`}
                        >
                            {/* Custom checkbox */}
                            <div className="relative shrink-0">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggle(item.id, !isChecked)}
                                    disabled={isPending}
                                    className="peer sr-only"
                                />
                                <div
                                    className={`h-5 w-5 rounded-md border-2 transition-all ${isChecked
                                            ? "border-indigo-500 bg-indigo-500"
                                            : "border-zinc-600 bg-zinc-800/50 peer-hover:border-zinc-500"
                                        }`}
                                >
                                    {isChecked && (
                                        <svg
                                            className="h-full w-full text-white p-0.5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Label */}
                            <span
                                className={`text-sm transition-colors ${isChecked
                                        ? "text-zinc-400 line-through"
                                        : "text-zinc-200"
                                    }`}
                            >
                                <span className="text-zinc-500 font-mono text-xs mr-2">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                {item.label}
                            </span>
                        </label>
                    );
                })}
            </div>

            {/* Completion celebration */}
            {completedCount === TOTAL && (
                <div className="bg-gradient-to-r from-indigo-950/50 to-violet-950/50 border border-indigo-800/40 rounded-2xl p-6 text-center space-y-2">
                    <p className="text-2xl">🎉</p>
                    <p className="text-lg font-semibold text-indigo-300">
                        Checklist Complete!
                    </p>
                    <p className="text-sm text-zinc-400">
                        Your firm is ready for AI adoption. Let&apos;s build your
                        roadmap together.
                    </p>
                    <Link
                        href="/auth/signin"
                        className="inline-block mt-3 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all"
                    >
                        Get Your Custom Roadmap
                    </Link>
                </div>
            )}
        </div>
    );
}
