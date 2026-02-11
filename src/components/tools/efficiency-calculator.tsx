// path: src/components/tools/efficiency-calculator.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { submitAudit } from "@/app/actions/audit-calculator";

const formSchema = z.object({
    firmName: z.string().min(1, "Firm name is required").max(200),
    staffCount: z.number().min(1, "Must have at least 1 staff member"),
    monthlyCases: z.number().min(1, "Must have at least 1 monthly case"),
    avgHoursPerCase: z.number().min(0.1, "Must be a positive number"),
});

type FormData = z.infer<typeof formSchema>;

interface AuditResult {
    annualLoss: number;
    firmName: string;
    monthlyCases: number;
    avgHoursPerCase: number;
    staffCount: number;
    owner: { type: "user" | "guest" };
}

interface EfficiencyCalculatorProps {
    initialOwnerType: "user" | "guest";
}

export default function EfficiencyCalculator({
    initialOwnerType,
}: EfficiencyCalculatorProps) {
    const [result, setResult] = useState<AuditResult | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firmName: "",
            staffCount: undefined,
            monthlyCases: undefined,
            avgHoursPerCase: undefined,
        },
    });

    async function onSubmit(data: FormData) {
        setIsSubmitting(true);
        setServerError(null);

        const response = await submitAudit(data);

        if (!response.success) {
            setServerError(response.error);
            setIsSubmitting(false);
            return;
        }

        setResult(response.data);
        setIsSubmitting(false);
    }

    // ─── State 2: Success ────────────────────────────────────────────
    if (result) {
        const isGuest = result.owner.type === "guest";

        return (
            <div className="space-y-6">
                {/* Guest CTA Banner */}
                {isGuest && (
                    <div className="sticky top-0 z-50 bg-amber-900/80 border border-amber-700/50 backdrop-blur-md rounded-xl px-6 py-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold text-amber-200">
                                Don&apos;t lose this report!
                            </p>
                            <p className="text-xs text-amber-300/70 mt-0.5">
                                Sign in to save it to your dashboard permanently.
                            </p>
                        </div>
                        <Link
                            href="/auth/signin"
                            className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400 transition-colors"
                        >
                            Save This Report →
                        </Link>
                    </div>
                )}

                {/* User saved badge */}
                {!isGuest && (
                    <div className="bg-emerald-900/40 border border-emerald-700/40 rounded-xl px-5 py-3 flex items-center gap-3">
                        <span className="text-emerald-400 text-lg">✓</span>
                        <p className="text-sm text-emerald-300 font-medium">
                            Report Saved to Dashboard
                        </p>
                    </div>
                )}

                {/* Results Card */}
                <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-8 backdrop-blur-sm">
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-2">
                        Efficiency Audit Report
                    </p>
                    <h2 className="text-lg font-semibold text-zinc-200 mb-8">
                        {result.firmName}
                    </h2>

                    {/* Annual Loss — the headline number */}
                    <div className="text-center py-8 border-y border-zinc-800/50">
                        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">
                            Estimated Annual Loss Due to Inefficiency
                        </p>
                        <p className="text-5xl sm:text-6xl font-extrabold text-red-500 tracking-tight">
                            ${result.annualLoss.toLocaleString("en-US")}
                        </p>
                        <p className="text-sm text-zinc-500 mt-3">
                            per year at $150/hr billable rate
                        </p>
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                        <StatCard label="Staff" value={result.staffCount.toString()} />
                        <StatCard
                            label="Monthly Cases"
                            value={result.monthlyCases.toString()}
                        />
                        <StatCard
                            label="Avg Hrs/Case"
                            value={result.avgHoursPerCase.toString()}
                        />
                        <StatCard
                            label="Monthly Loss"
                            value={`$${(result.annualLoss / 12).toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
                        />
                    </div>
                </div>

                {/* Recalculate */}
                <button
                    onClick={() => setResult(null)}
                    className="w-full rounded-xl border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all"
                >
                    Run Another Audit
                </button>
            </div>
        );
    }

    // ─── State 1: Input Form ─────────────────────────────────────────
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-8 backdrop-blur-sm space-y-6">
                <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-1">
                        Free Tool
                    </p>
                    <h2 className="text-xl font-semibold text-zinc-100">
                        Immigration Efficiency Audit
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">
                        Enter your firm details to see how much revenue you&apos;re
                        losing to process inefficiency.
                    </p>
                </div>

                <div className="space-y-5">
                    <Field
                        label="Firm Name"
                        id="firmName"
                        error={errors.firmName?.message}
                    >
                        <input
                            id="firmName"
                            type="text"
                            placeholder="e.g. Smith & Associates"
                            {...register("firmName")}
                            className="w-full rounded-lg border border-zinc-700/80 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                        />
                    </Field>

                    <Field
                        label="Number of Staff"
                        id="staffCount"
                        error={errors.staffCount?.message}
                    >
                        <input
                            id="staffCount"
                            type="number"
                            min={1}
                            placeholder="e.g. 12"
                            {...register("staffCount", { valueAsNumber: true })}
                            className="w-full rounded-lg border border-zinc-700/80 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                        />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field
                            label="Monthly Cases"
                            id="monthlyCases"
                            error={errors.monthlyCases?.message}
                        >
                            <input
                                id="monthlyCases"
                                type="number"
                                min={1}
                                placeholder="e.g. 40"
                                {...register("monthlyCases", { valueAsNumber: true })}
                                className="w-full rounded-lg border border-zinc-700/80 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                            />
                        </Field>

                        <Field
                            label="Avg. Hours per Case"
                            id="avgHoursPerCase"
                            error={errors.avgHoursPerCase?.message}
                        >
                            <input
                                id="avgHoursPerCase"
                                type="number"
                                min={0.1}
                                step={0.1}
                                placeholder="e.g. 8.5"
                                {...register("avgHoursPerCase", { valueAsNumber: true })}
                                className="w-full rounded-lg border border-zinc-700/80 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
                            />
                        </Field>
                    </div>
                </div>
            </div>

            {serverError && (
                <div className="rounded-xl bg-red-950/50 border border-red-800/50 px-5 py-3">
                    <p className="text-sm text-red-400">{serverError}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <Spinner />
                        Calculating…
                    </span>
                ) : (
                    "Calculate Annual Loss"
                )}
            </button>
        </form>
    );
}

// ─── Sub-components ──────────────────────────────────────────────────

function Field({
    label,
    id,
    error,
    children,
}: {
    label: string;
    id: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-zinc-300 mb-1.5"
            >
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-1 text-xs text-red-400">{error}</p>
            )}
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl bg-zinc-800/40 border border-zinc-700/40 p-4 text-center">
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <p className="text-lg font-semibold text-zinc-200">{value}</p>
        </div>
    );
}

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
