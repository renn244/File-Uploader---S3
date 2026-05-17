import axiosClient from "#/lib/axiosClient"
import { useAuth } from "@clerk/clerk-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


export const useCreateFolderMutation = () => {
    const queryClient = useQueryClient()
    const { getToken } = useAuth()

    return useMutation({
        mutationKey: ["folder", "create"],
        mutationFn: async (data: { name: string }) => {
            const token = await getToken();
            
            const res = await axiosClient.post("/folders", data, {
                "headers": {
                    "Authorization":  `Bearer ${token}`
                }
            })
            return res.data
        },
        onError: () => {
            toast.error("Failed to create folder")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folder", "list"] })
            toast.success("Folder created")
        },
    })
}

export const useGetFoldersQuery = () => {
    const { getToken } = useAuth()

    return useQuery({
        queryKey: ["folder", "list"],
        queryFn: async () => {
            const token = await getToken();
            const res = await axiosClient.get("/folders", {
                "headers": {
                    "Authorization": `Bearer ${token}`
                }
            })
            return res.data ||  []
        }
    })
}

export const useGetFolderByIdQuery = (folderId: string) => {
    const { getToken } = useAuth()!

    return useQuery({
        queryKey: ["folder", "byId", folderId],
        enabled: !!folderId,
        queryFn: async () => {
            const token = await getToken();
            const res = await axiosClient.get(`/folders/${folderId}`, {
                "headers": {
                    "Authorization": `Bearer ${token}`
                }
            })
            return res.data
        }
    })
}

export const useUpdateFolderByIdMutation = (folderId: string) => {
    const queryClient = useQueryClient()
        const { getToken } = useAuth()!

    return useMutation({
        mutationKey: ["folder", "update", folderId],
        mutationFn: async (data: { name: string }) => {
            const token = await getToken();
            const res = await axiosClient.patch(`/folders/${folderId}`, data, {
                "headers": {
                    "Authorization": `Bearer ${token}`
                }
            })
            return res.data
        },
        onError: () => {
            toast.error("Failed to update folder")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folder"] })
            toast.success("Folder updated")
        },
    })
}

export const useDeleteFolderByIdMutation = (folderId: string) => {
    const queryClient = useQueryClient()
    const { getToken } = useAuth()!

    return useMutation({
        mutationKey: ["folder", "delete", folderId],
        mutationFn: async () => {
            const token = await getToken();
            const res = await axiosClient.delete(`/folders/${folderId}`, {
                "headers": {
                    "Authorization": `Bearer ${token}`
                }
            })
            return res.data
        },
        onError: () => {
            toast.error("Failed to delete folder")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folder", "list"] })
            toast.success("Folder deleted")
        },
    })
}