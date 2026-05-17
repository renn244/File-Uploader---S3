import { useGetFoldersQuery } from "#/hook/folder.hook";
import { Link } from "@tanstack/react-router";
import { CreateFolderDialog } from "./createFolderDialog";
import { FolderCard } from "./folderCard";

const FoldersView = () => {
    const { data: folders } = useGetFoldersQuery()

    return (
        <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Folders</h1>
                        <p className="text-foreground/60 mt-1">Organize and manage your photos</p>
                    </div>
                    <CreateFolderDialog />
                </div>

                {folders?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {folders.map((folder: any) => (
                            <Link to='/dashboard/folder/$folderId' params={{ folderId: folder.id }} key={folder.id} className="cursor-pointer">
                                <FolderCard
                                id={folder.id}
                                name={folder.name}
                                photoCount={folder.photoCount}
                                createdAt={folder.createdAt}
                                />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-foreground/60 mb-4">No folders yet</p>
                        <p className="text-sm text-foreground/50 mb-6">Create your first folder to get started</p>
                        <CreateFolderDialog />
                    </div>
                )}
        </div>
    )
}

export default FoldersView