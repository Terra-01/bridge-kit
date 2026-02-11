// path: src/app/actions/audit-calculator.ts
"use server";

import { z } from "zod";
import { getCurrentOwner } from "@/lib/auth/get-owner";
import { connectDB } from "@/lib/db/mongodb";
import { AuditReport } from "@/models/audit-report";
import { createSafeAction } from "@/lib/safe-action";

const HOURLY_RATE = 150;

const auditInputSchema = z.object({
    firmName: z.string().min(1, "Firm name is required").max(200),
    staffCount: z.number().min(1, "Must have at least 1 staff member"),
    monthlyCases: z.number().min(1, "Must have at least 1 monthly case"),
    avgHoursPerCase: z.number().min(0.1, "Must be a positive number"),
});

type AuditInput = z.infer<typeof auditInputSchema>;

interface AuditResult {
    annualLoss: number;
    firmName: string;
    monthlyCases: number;
    avgHoursPerCase: number;
    staffCount: number;
    owner: { type: "user" | "guest" };
}

/**
 * submitAudit — Calculates ROI and saves report to MongoDB.
 *
 * Protocol:
 *   1. Resolve identity via getCurrentOwner() (GUEST or USER)
 *   2. Calculate Annual Loss = monthlyCases * avgHoursPerCase * $150 * 12
 *   3. Save AuditReport with resolved ownerId
 *   4. Return calculated data + owner type to client
 */
export const submitAudit = createSafeAction<AuditInput, AuditResult>(
    auditInputSchema,
    async (data): Promise<AuditResult> => {
        // Step 1: Resolve identity
        const owner = await getCurrentOwner();

        // Step 2: Calculate annual loss
        const annualLoss =
            data.monthlyCases * data.avgHoursPerCase * HOURLY_RATE * 12;

        // Step 3: Save to MongoDB
        await connectDB();
        await AuditReport.create({
            ownerId: owner.ownerId,
            firmName: data.firmName,
            staffCount: data.staffCount,
            monthlyCases: data.monthlyCases,
            avgHoursPerCase: data.avgHoursPerCase,
            calculatedAnnualLoss: annualLoss,
        });

        // Step 4: Return result
        return {
            annualLoss,
            firmName: data.firmName,
            monthlyCases: data.monthlyCases,
            avgHoursPerCase: data.avgHoursPerCase,
            staffCount: data.staffCount,
            owner: { type: owner.type },
        };
    }
);
