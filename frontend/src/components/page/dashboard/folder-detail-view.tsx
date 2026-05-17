import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { PhotoGrid } from './photo-grid';
import { UploadPhotoDialog } from './uploadPhotoDialog';

interface FolderDetailViewProps {
    folderId?: string;
    folderName?: string;
    photos?: any;
}

export function FolderDetailView({ folderId, folderName = 'Project Photos', photos = [] }: FolderDetailViewProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-foreground/60">
                <Link to="/dashboard" className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>
                <span>/</span>
                <span className="text-foreground">{folderName}</span>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{folderName}</h1>
                    <p className="text-foreground/60 mt-1">{photos.length} photos</p>
                </div>
                <UploadPhotoDialog folderId={folderId!} />
            </div>

            {photos.length > 0 ? (
                <PhotoGrid photos={photos} />
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-foreground/60 mb-4">No photos yet</p>
                    <p className="text-sm text-foreground/50 mb-6">Upload your first photo to get started</p>
                    <UploadPhotoDialog folderId={folderId!} />
                </div>
            )}
        </div>
    );
}
