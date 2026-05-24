import axiosClient from "#/lib/axiosClient";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadPhotoMutation = (folderId: string) => {
    const queryClient = useQueryClient();
    const { getToken } = useAuth();

    return useMutation({
        mutationKey: ['photo', 'upload', folderId],
        mutationFn: async ({
            file,
            s3Info,
            uploadUrl
        }: {
            file: File | null,
            s3Info: { bucket: string, key: string } | null,
            uploadUrl: string | null
        }) => {
            const token = await getToken();

            if (!file) {
                throw new Error("File is required");
            }

            if(!uploadUrl || !s3Info) {
                throw new Error("Upload URL and S3 info are required");
            }

            const uploadResponse = await axiosClient.put(uploadUrl, file, {
                headers: {
                    "Content-Type": file.type,
                }
            })

            if(uploadResponse.status !== 200) {
                throw new Error("Failed to upload file to S3");
            }

            const response = await axiosClient.post(
                `/file-upload/${folderId}`, 
                {
                    originalName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    s3Bucket: s3Info.bucket,
                    s3Key: s3Info.key
                }, 
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                }
            )

            return response.data;
        },
        onError: () => {
            toast.error("Failed to upload photo");
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