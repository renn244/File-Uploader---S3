import { useAuth } from "@clerk/clerk-react";
import { LoaderCircle, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { getUploadUrl, useUploadPhotoMutation } from "#/hook/fileUpload.hook";
import { formatBytes } from "#/lib/format";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type UploadPhotoDialogProps = {
	folderId: string;
};

export function UploadPhotoDialog({ folderId }: UploadPhotoDialogProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);

	const [isOpen, setIsOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [isPreparing, setIsPreparing] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [uploadUrl, setUploadUrl] = useState<string | null>(null);
	const [s3Info, setS3Info] = useState<{ bucket: string; key: string } | null>(
		null,
	);

	const { mutateAsync: uploadPhoto, isPending: isUploading } =
		useUploadPhotoMutation(folderId);

	const { getToken } = useAuth();

	function resetDialogState() {
		setIsDragging(false);
		setIsPreparing(false);
		setFile(null);
		setUploadUrl(null);
		setS3Info(null);

		if (inputRef.current) {
			inputRef.current.value = "";
		}
	}

	async function handleFile(selectedFiles: FileList | null) {
		if (!selectedFiles || selectedFiles.length === 0) return;

		const nextFile = selectedFiles[0];

		setIsPreparing(true);

		try {
			const uploadTarget = await getUploadUrl(getToken, folderId, nextFile);
			setFile(nextFile);
			setUploadUrl(uploadTarget.url);
			setS3Info({ bucket: uploadTarget.bucket, key: uploadTarget.key });
		} catch {
			setFile(null);
			setUploadUrl(null);
			setS3Info(null);
			toast.error("Failed to prepare secure upload");
		} finally {
			setIsPreparing(false);
		}
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

		void handleFile(e.dataTransfer.files);
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);

				if (!open) {
					resetDialogState();
				}
			}}
		>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Upload className="w-4 h-4" />
					Upload File
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:min-w-[425px]">
				<DialogHeader>
					<DialogTitle>Upload File</DialogTitle>
					<DialogDescription>
						Drag and drop a file or browse your device to create a secure
						upload.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<Input
						ref={inputRef}
						id="photo-upload"
						type="file"
						className="hidden"
						onChange={(e) => {
							void handleFile(e.target.files);
						}}
					/>

					<label
						htmlFor="photo-upload"
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className={`
              rounded-3xl border-2 border-dashed p-8
              flex flex-col items-center justify-center
              text-center cursor-pointer transition-colors
              ${
								isDragging
									? "border-[color:var(--lagoon-deep)] bg-[color:var(--lagoon)]/10"
									: "border-white/45 bg-white/50 hover:bg-white/70"
							}
            `}
					>
						<div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--lagoon)]/12 text-[color:var(--lagoon-deep)]">
							{isPreparing ? (
								<LoaderCircle className="h-6 w-6 animate-spin" />
							) : (
								<Upload className="h-6 w-6" />
							)}
						</div>

						<p className="mb-1 font-medium text-foreground">
							{isPreparing ? "Preparing secure upload" : "Drag your file here"}
						</p>

						<p className="text-sm text-foreground/60">
							{isPreparing
								? "Requesting an upload slot..."
								: "or click to browse"}
						</p>
					</label>

					{file && (
						<div className="rounded-2xl border border-white/40 bg-white/55 p-4 text-sm text-foreground/75">
							<p className="font-medium text-foreground">{file.name}</p>
							<p className="mt-1 text-xs text-muted-foreground">
								{formatBytes(file.size)} {file.type ? `| ${file.type}` : ""}
							</p>
						</div>
					)}

					<div className="flex gap-2 justify-end pt-4">
						<Button
							onClick={() => setIsOpen(false)}
							disabled={isUploading || isPreparing}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							onClick={() =>
								uploadPhoto(
									{
										file,
										s3Info,
										uploadUrl,
									},
									{
										onSuccess: () => {
											resetDialogState();
											setIsOpen(false);
										},
									},
								)
							}
							disabled={
								!file || isUploading || isPreparing || !uploadUrl || !s3Info
							}
						>
							{isUploading ? "Uploading..." : "Upload file"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
