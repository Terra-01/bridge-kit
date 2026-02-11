// path: src/app/page.tsx
import Link from "next/link";
import {
  TrendingDown,
  ListChecks,
  FileText,
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Lock,
  Zap,
} from "lucide-react";

const TOOLS = [
  {
    icon: TrendingDown,
    title: "Efficiency Audit",
    copy: "Calculate exactly how much revenue you lose to manual data entry. See your ROI in 30 seconds.",
    href: "/tools/efficiency-audit",
    accent: "from-red-500 to-orange-500",
    accentBg: "bg-red-950/30 border-red-800/30",
    iconColor: "text-red-400",
  },
  {
    icon: ListChecks,
    title: "AI Readiness Checklist",
    copy: "Is your firm ready for automation? A 20-point interactive guide to risk-free AI adoption.",
    href: "/tools/ai-checklist",
    accent: "from-indigo-500 to-violet-500",
    accentBg: "bg-indigo-950/30 border-indigo-800/30",
    iconColor: "text-indigo-400",
  },
  {
    icon: FileText,
    title: "SOP Template Pack",
    copy: "Download battle-tested SOPs for Asylum, Family Visas, and Employment cases. Standardize your success.",
    href: "/tools/sop-pack",
    accent: "from-emerald-500 to-teal-500",
    accentBg: "bg-emerald-950/30 border-emerald-800/30",
    iconColor: "text-emerald-400",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            BridgeKit
          </span>
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

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 sm:py-32 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/[0.07] blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-indigo-800/50 bg-indigo-950/30 px-4 py-1.5 text-xs font-medium text-indigo-300 backdrop-blur-sm gap-1.5">
            <Zap className="h-3 w-3" />
            AI-Powered Immigration Tools
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
            <span className="bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Automate Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Immigration Practice.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Stop drowning in paperwork. Use our free AI-powered
            tools to audit your efficiency, prepare for automation,
            and standardize your case management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/tools/efficiency-audit"
              className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all"
            >
              Start Efficiency Audit
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#tools"
              className="flex items-center gap-2 rounded-xl border border-zinc-700 px-7 py-3.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-600 transition-all"
            >
              View All Tools
              <ChevronDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Tools Grid ──────────────────────────────────────── */}
      <section
        id="tools"
        className="px-6 py-20 sm:py-28 border-t border-zinc-800/50"
      >
        <div className="mx-auto max-w-6xl space-y-14">
          <div className="text-center space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-400">
              Free Tools
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                Everything You Need to
              </span>{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Get Started
              </span>
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Three purpose-built tools designed for immigration
              law firms ready to embrace efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-7 backdrop-blur-sm hover:border-zinc-700/80 hover:bg-zinc-900/80 transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`h-11 w-11 rounded-xl ${tool.accentBg} border flex items-center justify-center mb-5`}
                >
                  <tool.icon
                    className={`h-5 w-5 ${tool.iconColor}`}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  {tool.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                  {tool.copy}
                </p>

                {/* CTA */}
                <span
                  className={`inline-flex items-center gap-1.5 text-sm font-medium bg-gradient-to-r ${tool.accent} bg-clip-text text-transparent`}
                >
                  Try it free
                  <ArrowRight className={`h-3.5 w-3.5 ${tool.iconColor} group-hover:translate-x-0.5 transition-transform`} />
                </span>

                {/* Hover gradient line */}
                <div
                  className={`absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r ${tool.accent} opacity-0 group-hover:opacity-40 transition-opacity duration-300`}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Banner ─────────────────────────────────────── */}
      <section className="border-t border-zinc-800/50 bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14">
            <TrustPill icon={ShieldCheck} label="SOC 2 Compliant" />
            <TrustPill icon={Lock} label="AES-256 Encrypted" />
            <TrustPill icon={Zap} label="AI-Powered Analysis" />
          </div>
          <p className="text-center text-xs text-zinc-600 mt-8">
            Powered by OpenSphere &amp; LegalBridge technology.
            Secure. Private. Encrypted.
          </p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/50 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            BridgeKit
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/tools/efficiency-audit"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Efficiency Audit
            </Link>
            <Link
              href="/tools/ai-checklist"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              AI Checklist
            </Link>
            <Link
              href="/tools/sop-pack"
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              SOP Pack
            </Link>
          </div>
          <p className="text-xs text-zinc-600">
            © 2026 BridgeKit. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function TrustPill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 text-zinc-400">
      <Icon className="h-4 w-4 text-zinc-500" strokeWidth={1.8} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
