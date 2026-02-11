// path: src/app/actions/checklist.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getCurrentOwner } from "@/lib/auth/get-owner";
import { connectDB } from "@/lib/db/mongodb";
import { ChecklistProgress } from "@/models/checklist-progress";
import { createSafeAction } from "@/lib/safe-action";

const toggleItemSchema = z.object({
    itemId: z.string().min(1, "Item ID is required"),
    isChecked: z.boolean(),
});

type ToggleInput = z.infer<typeof toggleItemSchema>;

interface ToggleResult {
    completedItems: string[];
    owner: { type: "user" | "guest" };
}

/**
 * toggleItem — Adds or removes an item from the checklist progress.
 *
 * Protocol:
 *   1. Resolve identity via getCurrentOwner()
 *   2. Use findOneAndUpdate with $addToSet / $pull + upsert
 *   3. Revalidate the page path
 *   4. Return updated completedItems
 */
export const toggleItem = createSafeAction<ToggleInput, ToggleResult>(
    toggleItemSchema,
    async (data): Promise<ToggleResult> => {
        const owner = await getCurrentOwner();

        await connectDB();

        const update = data.isChecked
            ? { $addToSet: { completedItems: data.itemId }, $set: { lastInteractedAt: new Date() } }
            : { $pull: { completedItems: data.itemId }, $set: { lastInteractedAt: new Date() } };

        const doc = await ChecklistProgress.findOneAndUpdate(
            { ownerId: owner.ownerId, checklistId: "ai-adoption-v1" },
            update,
            { upsert: true, new: true }
        );

        revalidatePath("/tools/ai-checklist");

        return {
            completedItems: doc.completedItems,
            owner: { type: owner.type },
        };
    }
);
