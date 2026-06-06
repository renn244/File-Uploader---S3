import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosClient from "#/lib/axiosClient";
import {
	type FolderDetailRecord,
	folderDetailSchema,
	type UploadUrlResponse,
	uploadUrlResponseSchema,
} from "#/types/storage";

type UploadPhotoInput = {
	file: File | null;
	s3Info: { bucket: string; key: string } | null;
	uploadUrl: string | null;
};

async function createAuthHeaders(getToken: () => Promise<string | null>) {
	const token = await getToken();

	return {
		Authorization: `Bearer ${token ?? ""}`,
	};
}

export async function getUploadUrl(
	getToken: () => Promise<string | null>,
	folderId: string,
	file: File,
) {
	const response = await axiosClient.get(
		`/file-upload/upload-url/${folderId}`,
		{
			params: {
				contentType: file.type || "application/octet-stream",
				fileName: file.name,
			},
			headers: await createAuthHeaders(getToken),
		},
	);

	return uploadUrlResponseSchema.parse(
		response.data,
	) satisfies UploadUrlResponse;
}

export const useUploadPhotoMutation = (folderId: string) => {
	const queryClient = useQueryClient();
	const { getToken } = useAuth();

	return useMutation({
		mutationKey: ["photo", "upload", folderId],
		mutationFn: async ({ file, s3Info, uploadUrl }: UploadPhotoInput) => {
			if (!file) {
				throw new Error("File is required");
			}

			if (!uploadUrl || !s3Info) {
				throw new Error("Upload URL and S3 info are required");
			}

			const uploadResponse = await axiosClient.put(uploadUrl, file, {
				headers: {
					"Content-Type": file.type || "application/octet-stream",
				},
			});

			if (uploadResponse.status !== 200) {
				throw new Error("Failed to upload file to S3");
			}

			const response = await axiosClient.post(
				`/file-upload/${folderId}`,
				{
					originalName: file.name,
					fileSize: file.size,
					fileType: file.type,
					s3Bucket: s3Info.bucket,
					s3Key: s3Info.key,
				},
				{
					headers: await createAuthHeaders(getToken),
				},
			);

			return response.data;
		},
		onError: () => {
			toast.error("Failed to upload file");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["photo", "list"] });
			toast.success("File uploaded");
		},
	});
};

export const useGetPhotosQuery = (folderId: string) => {
	const { getToken } = useAuth();

	return useQuery<FolderDetailRecord>({
		queryKey: ["photo", "list", folderId],
		enabled: Boolean(folderId),
		queryFn: async () => {
			const response = await axiosClient.get(`/file-upload/${folderId}`, {
				headers: await createAuthHeaders(getToken),
			});

			return folderDetailSchema.parse(response.data);
		},
	});
};

export const useDeletePhoto = (photoId: string) => {
	const queryClient = useQueryClient();
	const { getToken } = useAuth();

	return useMutation({
		mutationKey: ["photo", "delete", photoId],
		mutationFn: async () => {
			const response = await axiosClient.delete(`/file-upload/${photoId}`, {
				headers: await createAuthHeaders(getToken),
			});

			return response.data;
		},
		onError: () => {
			toast.error("Failed to delete file");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["photo", "list"] });
			toast.success("File deleted");
		},
	});
};
