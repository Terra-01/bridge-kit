// path: src/models/asset-access.ts
import mongoose, { Schema, type Document, type Model } from "mongoose";
import { applyBaseSchema } from "./base";

export interface IAssetAccess extends Document {
    ownerId: string;
    assetId: string;
    downloadedAt: Date;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const assetAccessSchema = new Schema<IAssetAccess>({
    assetId: {
        type: String,
        required: [true, "Asset ID is required"],
        index: true,
    },
    downloadedAt: {
        type: Date,
        default: Date.now,
    },
});

// Apply base fields: ownerId, isArchived, timestamps
applyBaseSchema(assetAccessSchema);

// Compound index for fast lookup
assetAccessSchema.index({ ownerId: 1, assetId: 1 });

export const AssetAccess: Model<IAssetAccess> =
    mongoose.models.AssetAccess ||
    mongoose.model<IAssetAccess>("AssetAccess", assetAccessSchema);
