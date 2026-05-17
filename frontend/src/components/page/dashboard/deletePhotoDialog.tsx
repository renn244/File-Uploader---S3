import { AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeletePhotoDialogProps {
    isOpen: boolean;
    photoName: string;
    isLoading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function DeletePhotoDialog({
    isOpen,
    photoName,
    isLoading,
    onConfirm,
    onCancel,
}: DeletePhotoDialogProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onCancel}>
            <AlertDialogContent className="max-w-md">
                <div className="flex gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                        <AlertCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <div className="flex-1">
                        <AlertDialogHeader className="p-0">
                            <AlertDialogTitle>Delete photo?</AlertDialogTitle>
                            <AlertDialogDescription className="text-base mt-2">
                                Are you sure you want to delete <span className="font-semibold text-foreground">"{photoName}"</span>?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="mt-4 p-3 bg-secondary/30 rounded-md border border-secondary">
                            <p className="text-sm text-foreground/80">
                                This action cannot be undone. The photo will be permanently deleted.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-border">
                    <AlertDialogCancel 
                    disabled={isLoading}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        onCancel();
                    }}
                    className="border border-border">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                    disabled={isLoading}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        onConfirm();
                    }}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
