// path: src/app/actions/asset.ts
"use server";

import { z } from "zod";
import { getCurrentOwner } from "@/lib/auth/get-owner";
import { connectDB } from "@/lib/db/mongodb";
import { AssetAccess } from "@/models/asset-access";
import { createSafeAction } from "@/lib/safe-action";

const trackDownloadSchema = z.object({
    assetId: z.string().min(1, "Asset ID is required"),
});

type TrackDownloadInput = z.infer<typeof trackDownloadSchema>;

interface TrackDownloadResult {
    downloadUrl: string;
    owner: { type: "user" | "guest" };
}

/**
 * trackDownload — Records asset access and returns a download link.
 *
 * Protocol:
 *   1. Resolve identity via getCurrentOwner()
 *   2. Record the download in AssetAccess
 *   3. Return download URL (mocked) + owner type for client CTA logic
 */
export const trackDownload = createSafeAction<TrackDownloadInput, TrackDownloadResult>(
    trackDownloadSchema,
    async (data): Promise<TrackDownloadResult> => {
        const owner = await getCurrentOwner();

        await connectDB();

        await AssetAccess.create({
            ownerId: owner.ownerId,
            assetId: data.assetId,
            downloadedAt: new Date(),
        });

        // Mock download URL — replace with signed URL in production
        const downloadUrl = "/downloads/sop-pack.pdf";

        return {
            downloadUrl,
            owner: { type: owner.type },
        };
    }
);
