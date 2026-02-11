// path: src/models/audit-report.ts
import mongoose, { Schema, type Document, type Model } from "mongoose";
import { applyBaseSchema } from "./base";

export interface IAuditReport extends Document {
    ownerId: string;
    firmName: string;
    staffCount: number;
    monthlyCases: number;
    avgHoursPerCase: number;
    calculatedAnnualLoss: number;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const auditReportSchema = new Schema<IAuditReport>({
    firmName: {
        type: String,
        required: [true, "Firm name is required"],
        trim: true,
        maxlength: [200, "Firm name must be under 200 characters"],
    },
    staffCount: {
        type: Number,
        required: [true, "Staff count is required"],
        min: [1, "Staff count must be at least 1"],
    },
    monthlyCases: {
        type: Number,
        required: [true, "Monthly cases is required"],
        min: [1, "Monthly cases must be at least 1"],
    },
    avgHoursPerCase: {
        type: Number,
        required: [true, "Average hours per case is required"],
        min: [0.1, "Average hours must be positive"],
    },
    calculatedAnnualLoss: {
        type: Number,
        required: [true, "Calculated annual loss is required"],
    },
});

// Apply base fields: ownerId, isArchived, timestamps
applyBaseSchema(auditReportSchema);

export const AuditReport: Model<IAuditReport> =
    mongoose.models.AuditReport || mongoose.model<IAuditReport>("AuditReport", auditReportSchema);
