import { Button } from '#/components/ui/button';
import { Card } from '@/components/ui/card';
import { Folder, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeleteFolderDialog } from './deleteFolderDialog';
import { useDeleteFolderByIdMutation } from '#/hook/folder.hook';

interface FolderCardProps {
    id: string;
    name: string;
    photoCount: number;
    createdAt: string;
    isClickable?: boolean;
}

export function FolderCard({ id, name, photoCount, createdAt, isClickable = true }: FolderCardProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { mutateAsync: deleteFolder, isPending: isDeleting } = useDeleteFolderByIdMutation(id);

    return (
        <Card className={`p-6 bg-card border-border hover:shadow-md transition-shadow ${isClickable ? 'cursor-pointer' : ''}`}>
            <div className="flex items-start justify-between mb-4">
                <Folder className="w-8 h-8 text-primary" />
                <Button onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setDeleteOpen(true)
                }} variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4 text-primary/70" />
                </Button>
                <DeleteFolderDialog
                isLoading={isDeleting} 
                isOpen={deleteOpen}
                onCancel={() => {
                    setDeleteOpen(false)
                }}
                onConfirm={() => deleteFolder().then(() => setDeleteOpen(false))}
                folderName={name}
                />
            </div>
            <h3 className="font-semibold text-foreground text-lg">{name}</h3>
            <div className="flex items-center justify-between">
                <p className="text-sm text-foreground/70">{photoCount} photo{photoCount !== 1 ? 's' : ''}</p>
                <p className="text-xs text-foreground/50">{createdAt}</p>
            </div>
        </Card>
    );
}
