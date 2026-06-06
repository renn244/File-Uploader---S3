import { Button } from "#/components/ui/button";
import { useDeletePhoto } from "#/hook/fileUpload.hook";
import { formatBytes, formatDateLabel } from "#/lib/format";
import type { PhotoRecord } from "#/types/storage";
import { Card } from "@/components/ui/card";
import {
	Download,
	Trash2
} from "lucide-react";
import { useState } from "react";
import { DeletePhotoDialog } from "./deletePhotoDialog";

interface PhotoGridProps {
	photos: PhotoRecord[];
}

export function PhotoGrid({ photos }: PhotoGridProps) {
	return (
		<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
			{photos.map((photo) => (
				<PhotoCard key={photo.id} photo={photo} />
			))}
		</div>
	);
}

function PhotoCard({ photo }: { photo: PhotoRecord }) {
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const { mutateAsync: deletePhoto, isPending: isDeleting } = useDeletePhoto(
		photo.id,
	);

	const downloadFromS3 = async (originalName: string, downloadUrl: string) => {
		try {
			const response = await fetch(downloadUrl);

			if (!response.ok) {
				throw new Error(`Download request failed with status ${response.status}`);
			}

			const blob = await response.blob();

			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = originalName;
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.setTimeout(() => URL.revokeObjectURL(url), 1000);
		} catch (error) {
			console.error("Download failed:", error);
		}
	};

	return (
		<>
			<Card className="dashboard-panel group gap-0 overflow-hidden border-white/45 p-0">
				<div className="relative flex h-52 items-center justify-center overflow-hidden border-b border-white/45 bg-[linear-gradient(135deg,rgba(79,184,178,0.12),rgba(255,255,255,0.72))]">
					<img
					className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
					src={photo.thumbnailUrl || photo.downloadUrl}
					alt={photo.originalName}
					onError={(e) => {
						e.currentTarget.src = photo.downloadUrl;
					}}
					/>
					<div className="absolute right-3 top-3 flex gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
						<Button
						onClick={() => downloadFromS3(photo.originalName, photo.downloadUrl)}						
						variant="secondary"
						size="icon-sm"
						className="rounded-full bg-white/80 shadow-sm backdrop-blur hover:bg-white"
						>
							<Download className="h-4 w-4" />
							<span className="sr-only">Download {photo.originalName}</span>
						</Button>
						<Button
						onClick={() => setIsDeleteOpen(true)}
						variant="secondary"
						size="icon-sm"
						className="rounded-full bg-white/80 shadow-sm backdrop-blur hover:bg-white"
						>
							<Trash2 className="h-4 w-4 text-foreground/80" />
							<span className="sr-only">Delete {photo.originalName}</span>
						</Button>
					</div>
				</div>

				<div className="space-y-4 p-4">
					<div className="space-y-1">
						<p className="truncate text-sm font-semibold text-foreground">
							{photo.originalName}
						</p>
						<p className="text-xs text-muted-foreground">
							{formatBytes(photo.sizeInBytes, photo.sizeLabel)}
						</p>
					</div>

					<div className="flex items-center justify-between text-xs text-foreground/55">
						<span>{photo.fileType ?? "Unknown file type"}</span>
						<span>{formatDateLabel(photo.uploadedAt)}</span>
					</div>

					<Button asChild variant="outline" className="w-full justify-center">
						<button
						type="button"
						onClick={() => downloadFromS3(photo.originalName, photo.downloadUrl)}
						>
							<Download className="h-4 w-4" />
							Download file
						</button>
					</Button>
				</div>
			</Card>

			<DeletePhotoDialog
				isLoading={isDeleting}
				isOpen={isDeleteOpen}
				photoName={photo.originalName}
				onConfirm={() => deletePhoto().then(() => setIsDeleteOpen(false))}
				onCancel={() => setIsDeleteOpen(false)}
			/>
		</>
	);
}
