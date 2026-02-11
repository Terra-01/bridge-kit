<div align="center">

# BridgeKit

### The Operating System for Modern Immigration Firms

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://bridge-kit.vercel.app/)

A production-grade SaaS foundation featuring Hybrid Auth, Transactional Data Merging, and High-Value Lead Magnets.

**[Live Demo →](https://bridge-kit.vercel.app/)**

</div>

---

## Live Modules

Three deployed, public-facing tools designed as high-conversion lead magnets for immigration law firms.

| Module | Description | Route |
|---|---|---|
| **Efficiency Audit Calculator** | ROI estimation with server-side math — calculates annual revenue loss from process inefficiency in under 30 seconds. | [`/tools/efficiency-audit`](https://bridge-kit.vercel.app/tools/efficiency-audit) |
| **AI Readiness Checklist** | 20-point interactive checklist with `useOptimistic` state preservation. Progress auto-saves per click via `$addToSet`/`$pull` operations. | [`/tools/ai-checklist`](https://bridge-kit.vercel.app/tools/ai-checklist) |
| **SOP Template Pack** | Gated asset download system — tracks access events in MongoDB, then surfaces a post-value capture modal to convert guests into users. | [`/tools/sop-pack`](https://bridge-kit.vercel.app/tools/sop-pack) |

All three tools work for both **Guest** and **Authenticated** users. Guest data is persisted and transferable.

---

## The Secret Sauce: Guest-to-User Atomic Merge

The core differentiator of BridgeKit is its **hybrid identity model**. Users interact with tools immediately — no sign-up required. When they authenticate, all their data is atomically transferred to their new account.

```
Guest clicks tools → Data saved under guest_session_id cookie
         ↓
Guest signs in via GitHub OAuth
         ↓
Dashboard layout triggers mergeGuestData() on mount
         ↓
Mongoose transaction: updateMany(ownerId: guest → user) across ALL models
         ↓
GuestMergeLog audit record created (idempotent)
         ↓
Guest cookie deleted — user owns everything
```

**Technical guarantees:**

- **Atomic** — `mongoose.startSession()` with `withTransaction()` ensures all-or-nothing migration across every model (Notes, Audit Reports, Checklist Progress, Asset Access).
- **Idempotent** — `GuestMergeLog` prevents duplicate merges if the cookie deletion fails post-commit.
- **Protected** — Edge middleware assigns `guest_session_id` to every anonymous visitor, ensuring identity continuity.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| Database | MongoDB with Mongoose 9 |
| Authentication | Auth.js v5 (GitHub OAuth) |
| Validation | Zod (all server action inputs) |
| Forms | React Hook Form + @hookform/resolvers |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Architecture

Every file in this codebase follows the invariants defined in [`AI_CONTEXT.md`](./AI_CONTEXT.md). Key rules:

- **Identity** — `getCurrentOwner()` is the single source of truth. No ad-hoc cookie reads.
- **Schema** — All models extend `BaseSchema` (`ownerId`, `isArchived`, timestamps). `ownerId` is immutable at the document level.
- **Actions** — All server actions use the `createSafeAction` wrapper with Zod validation. `"use server"` lives on the action file, not the factory.
- **Runtime isolation** — Middleware runs on Edge (no Mongoose). Auth + DB logic stays in Node.

```
src/
├── app/
│   ├── (protected)/dashboard/     ← Authenticated dashboard + merge trigger
│   ├── (public)/tools/            ← Public lead magnet pages
│   │   ├── efficiency-audit/      ← ROI Calculator
│   │   ├── ai-checklist/          ← Interactive 20-point checklist
│   │   └── sop-pack/              ← Gated SOP downloads
│   └── actions/                   ← Server actions (audit, checklist, asset, merge)
├── components/tools/              ← Client components for each tool
├── lib/
│   ├── auth/                      ← Auth.js config, identity resolver, types
│   ├── db/                        ← MongoDB connection singleton
│   └── safe-action.ts             ← Generic action wrapper
├── models/                        ← Mongoose models (BaseSchema plugin)
└── middleware.ts                   ← Edge: auth check + guest cookie assignment
```

---

## Quick Start

```bash
# Clone
git clone https://github.com/your-org/bridge-kit.git
cd bridge-kit

# Install
npm install

# Environment
cp .env.local.example .env.local
# Fill in: MONGODB_URI, AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> For deep architectural rules and coding invariants, see [`AI_CONTEXT.md`](./AI_CONTEXT.md).

---

<div align="center">
<sub>Built by the OpenSphere × LegalBridge engineering team.</sub>
</div>