import { useDeletePhoto } from '#/hook/fileUpload.hook';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DeletePhotoDialog } from './deletePhotoDialog';

interface PhotoGridProps {
  photos: any[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
    
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
                <PhotoCard key={photo.id} photo={photo} />
            ))}
        </div>
    );
}

function PhotoCard({ photo }: { photo: any }) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    
    const { mutateAsync: deletePhoto, isPending: isDeleting } = useDeletePhoto(photo.id);

    return (
        <>
            <Card key={photo.id} className="overflow-hidden bg-secondary hover:shadow-md transition-shadow">
                <div className={`h-32 flex items-center justify-center relative group`}>
                    <img className='h-32' src={photo.downloadUrl.url} />
                    <button 
                    onClick={() => setIsDeleteOpen(true)}
                    className="absolute top-2 right-2 p-1 bg-foreground/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4 text-foreground/70" />
                    </button>
                </div>
                <div className="p-3">
                    <p className="text-sm font-medium text-foreground truncate">{photo.originalName}</p>
                    <p className="text-xs text-foreground/60">{photo.size}</p>
                    <p className="text-xs text-foreground/50 mt-1">{photo.uploadedAt}</p>
                </div>
            </Card>

            <DeletePhotoDialog 
            isLoading={isDeleting}
            isOpen={isDeleteOpen}
            photoName={photo.name}
            onConfirm={() => deletePhoto()}
            onCancel={() => setIsDeleteOpen(false)}
            />
        </>
    )
}