import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteFolderDialogProps {
  isOpen: boolean;
  folderName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function DeleteFolderDialog({
  isOpen,
  folderName,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteFolderDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent className="max-w-md">
        <div className="flex gap-2">
          <div className="flex-1">
            <AlertDialogHeader className="p-0">
              <AlertDialogTitle className='text-destructive'>Delete folder?</AlertDialogTitle>
              <AlertDialogDescription className="text-base mt-2">
                Are you sure you want to delete <span className="font-semibold text-foreground">"{folderName}"</span>?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-4 p-3 bg-secondary/30 rounded-md border border-secondary">
              <p className="text-sm text-foreground/80">
                This action cannot be undone. All  photo photoCounts in this folder will be permanently deleted.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-3 pt-4 border-t border-border">
          <AlertDialogCancel 
          disabled={isLoading}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            onCancel();
          }} className="border border-border">Cancel</AlertDialogCancel>
          <AlertDialogAction
          disabled={isLoading}
          variant="destructive"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            onConfirm();
          }}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
