// path: src/app/(public)/tools/efficiency-audit/page.tsx
import { getCurrentOwner } from "@/lib/auth/get-owner";
import EfficiencyCalculator from "@/components/tools/efficiency-calculator";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Immigration Efficiency Audit | BridgeKit",
    description:
        "Free tool for immigration law firms — calculate how much revenue you lose to process inefficiency each year.",
};

export default async function EfficiencyAuditPage() {
    const owner = await getCurrentOwner();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
            {/* Nav */}
            <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md">
                <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent"
                    >
                        SaaS Foundation
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/auth/signin"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <main className="flex-1 flex flex-col items-center px-6 py-12 sm:py-16">
                <div className="w-full max-w-xl space-y-8">
                    {/* Page Header */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center rounded-full border border-indigo-800/50 bg-indigo-950/30 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-sm">
                            Free Audit Tool
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            <span className="bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                                Immigration Efficiency
                            </span>{" "}
                            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                                Audit
                            </span>
                        </h1>
                        <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                            Discover how much your firm loses annually to
                            inefficient immigration case management.
                        </p>
                    </div>

                    {/* Calculator Component */}
                    <EfficiencyCalculator initialOwnerType={owner.type} />
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-800/50 py-6 text-center text-xs text-zinc-600">
                SaaS Foundation Boilerplate
            </footer>
        </div>
    );
}
