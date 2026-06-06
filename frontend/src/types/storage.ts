import { z } from "zod";

const signedAssetSchema = z.object({
	url: z.string().min(1),
});

const rawPhotoSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	originalName: z.string().optional(),
	size: z.union([z.string(), z.number()]).optional(),
	fileSize: z.number().optional(),
	fileType: z.string().optional(),
	uploadedAt: z.string(),
	thumbnailUrl: signedAssetSchema.nullish(),
	downloadUrl: signedAssetSchema,
});

export const photoSchema = rawPhotoSchema.transform((photo) => ({
	id: photo.id,
	originalName: photo.originalName ?? photo.name ?? "Untitled file",
	sizeInBytes:
		typeof photo.fileSize === "number"
			? photo.fileSize
			: typeof photo.size === "number"
				? photo.size
				: null,
	sizeLabel: typeof photo.size === "string" ? photo.size : null,
	fileType: photo.fileType ?? null,
	uploadedAt: photo.uploadedAt,
	thumbnailUrl: photo.thumbnailUrl?.url ?? null,
	downloadUrl: photo.downloadUrl.url,
}));

export const folderSchema = z.object({
	id: z.string(),
	name: z.string(),
	photoCount: z.coerce.number().default(0),
	createdAt: z.string(),
});

export const foldersSchema = z.array(folderSchema);

export const folderDetailSchema = z.object({
	id: z.string(),
	name: z.string(),
	photos: z.array(photoSchema).default([]),
});

export const uploadUrlResponseSchema = z.object({
	url: z.string().min(1),
	bucket: z.string().min(1),
	key: z.string().min(1),
});

export type PhotoRecord = z.infer<typeof photoSchema>;
export type FolderRecord = z.infer<typeof folderSchema>;
export type FolderDetailRecord = z.infer<typeof folderDetailSchema>;
export type UploadUrlResponse = z.infer<typeof uploadUrlResponseSchema>;
