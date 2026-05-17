import axiosClient from "#/lib/axiosClient";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadPhotoMutation = (folderId: string) => {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    return useMutation({
        mutationKey: ['photo', 'upload', folderId],
        mutationFn: async (file: File | undefined) => {
            const token = await getToken();

            if (!file) {
                throw new Error("File is required");
            }

            const formData = new FormData();
            formData.append('photo', file)

            const response = await axiosClient.post(`/file-upload/${folderId}`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            return response.data;
        },
        onError: () => {
            toast.error("Failed to upload photo")     
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['photo', 'list'] })
            toast.success("Photo uploaded")
        }
    })
}

export const useGetPhotosQuery = (folderId: string) => {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: ['photo', 'list', folderId],
        queryFn: async () => {
            const token = await getToken();
            const response = await axiosClient.get(`/file-upload/${folderId}`,  {
                "headers": {
                    "Authorization": `Bearer ${token}`
                }
            })
            
            return response.data || [];
        },
    })
}

export const useDeletePhoto = (photoId: string) => {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    return useMutation({
        mutationKey: ['photo', 'delete'],
        mutationFn: async () => {
            const token = await getToken();
            const response = await axiosClient.delete(`/file-upload/${photoId}`, {
                "headers": {
                    "Authorization": `Bearer ${token}`
                }
            }) 
            
            return response.data;
        },
        onError: () => {
            toast.error("Failed to delete photo")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['photo', 'list'] })
            toast.success("Photo deleted")
        }
    })
}