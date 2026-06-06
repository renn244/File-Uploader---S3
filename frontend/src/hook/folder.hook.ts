import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosClient from "#/lib/axiosClient";
import {
	type FolderRecord,
	folderSchema,
	foldersSchema,
} from "#/types/storage";

async function createAuthHeaders(getToken: () => Promise<string | null>) {
	const token = await getToken();

	return {
		Authorization: `Bearer ${token ?? ""}`,
	};
}

export const useCreateFolderMutation = () => {
	const queryClient = useQueryClient();
	const { getToken } = useAuth();

	return useMutation({
		mutationKey: ["folder", "create"],
		mutationFn: async (data: { name: string }) => {
			const response = await axiosClient.post("/folders", data, {
				headers: await createAuthHeaders(getToken),
			});

			return folderSchema.parse(response.data);
		},
		onError: () => {
			toast.error("Failed to create folder");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folder", "list"] });
			toast.success("Folder created");
		},
	});
};

export const useGetFoldersQuery = () => {
	const { getToken } = useAuth();

	return useQuery<FolderRecord[]>({
		queryKey: ["folder", "list"],
		queryFn: async () => {
			const response = await axiosClient.get("/folders", {
				headers: await createAuthHeaders(getToken),
			});

			return foldersSchema.parse(response.data ?? []);
		},
	});
};

export const useGetFolderByIdQuery = (folderId: string) => {
	const { getToken } = useAuth();

	return useQuery<FolderRecord>({
		queryKey: ["folder", "byId", folderId],
		enabled: Boolean(folderId),
		queryFn: async () => {
			const response = await axiosClient.get(`/folders/${folderId}`, {
				headers: await createAuthHeaders(getToken),
			});

			return folderSchema.parse(response.data);
		},
	});
};

export const useUpdateFolderByIdMutation = (folderId: string) => {
	const queryClient = useQueryClient();
	const { getToken } = useAuth();

	return useMutation({
		mutationKey: ["folder", "update", folderId],
		mutationFn: async (data: { name: string }) => {
			const response = await axiosClient.patch(`/folders/${folderId}`, data, {
				headers: await createAuthHeaders(getToken),
			});

			return folderSchema.parse(response.data);
		},
		onError: () => {
			toast.error("Failed to update folder");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folder"] });
			toast.success("Folder updated");
		},
	});
};

export const useDeleteFolderByIdMutation = (folderId: string) => {
	const queryClient = useQueryClient();
	const { getToken } = useAuth();

	return useMutation({
		mutationKey: ["folder", "delete", folderId],
		mutationFn: async () => {
			const response = await axiosClient.delete(`/folders/${folderId}`, {
				headers: await createAuthHeaders(getToken),
			});

			return response.data;
		},
		onError: () => {
			toast.error("Failed to delete folder");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["folder", "list"] });
			toast.success("Folder deleted");
		},
	});
};
