import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUploadPhotoMutation } from '#/hook/fileUpload.hook';

type UploadPhotoDialogProps = {
  folderId: string;
}

export function UploadPhotoDialog({ folderId }: UploadPhotoDialogProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { mutateAsync: uploadPhoto, isPending: isUploading } = useUploadPhotoMutation(folderId);

  function handleFile(selectedFiles: FileList | null) {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setFile(selectedFiles[0]);
  }

  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    handleFile(e.dataTransfer.files);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
        className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Photo
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:min-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Photo</DialogTitle>
          <DialogDescription>
            Drag and drop your photo or click to select.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
          ref={inputRef}
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files)}
          />

          <label
            htmlFor="photo-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8
              flex flex-col items-center justify-center
              text-center cursor-pointer transition-colors
              ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-secondary/50'
              }
            `}
          >
            <Upload className="w-8 h-8 text-accent mb-2" />

            <p className="font-medium text-foreground mb-1">
              Drag photo here
            </p>

            <p className="text-sm text-foreground/60">
              or click to browse
            </p>
          </label>

          {file && (
            <div className="text-sm text-muted-foreground">
              Selected: {file.name}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button onClick={() => setIsOpen(false)} disabled={isUploading} variant="outline">
                Cancel
            </Button>
            <Button onClick={() => uploadPhoto(file!, { onSuccess: () => setIsOpen(false) })} disabled={!file || isUploading}>
                Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}