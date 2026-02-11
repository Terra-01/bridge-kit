// path: src/models/checklist-progress.ts
import mongoose, { Schema, type Document, type Model } from "mongoose";
import { applyBaseSchema } from "./base";

export interface IChecklistProgress extends Document {
    ownerId: string;
    checklistId: string;
    completedItems: string[];
    lastInteractedAt: Date;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const checklistProgressSchema = new Schema<IChecklistProgress>({
    checklistId: {
        type: String,
        default: "ai-adoption-v1",
        index: true,
    },
    completedItems: {
        type: [String],
        default: [],
    },
    lastInteractedAt: {
        type: Date,
        default: Date.now,
    },
});

// Apply base fields: ownerId, isArchived, timestamps
applyBaseSchema(checklistProgressSchema);

// Compound index for fast lookup by owner + checklist
checklistProgressSchema.index({ ownerId: 1, checklistId: 1 }, { unique: true });

export const ChecklistProgress: Model<IChecklistProgress> =
    mongoose.models.ChecklistProgress ||
    mongoose.model<IChecklistProgress>("ChecklistProgress", checklistProgressSchema);
