import { Link } from "@tanstack/react-router";
import { ArrowLeft, Download, FolderOpen } from "lucide-react";
import { formatCountLabel } from "#/lib/format";
import type { PhotoRecord } from "#/types/storage";
import { DashboardEmptyState } from "./dashboardStates";
import { PhotoGrid } from "./photo-grid";
import { UploadPhotoDialog } from "./uploadPhotoDialog";

interface FolderDetailViewProps {
	folderId: string;
	folderName: string;
	photos: PhotoRecord[];
}

export function FolderDetailView({
	folderId,
	folderName,
	photos,
}: FolderDetailViewProps) {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2 text-sm text-foreground/60">
				<Link
					to="/dashboard"
					className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-4 w-4" />
					Back
				</Link>
				<span>/</span>
				<span className="text-foreground">{folderName}</span>
			</div>

			<section className="dashboard-panel overflow-hidden p-6 sm:p-8">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div className="space-y-4">
						<span className="dashboard-kicker">Folder</span>
						<div className="space-y-2">
							<h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
								{folderName}
							</h1>
							<p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
								Preview image files, keep everything sorted, and download
								originals whenever needed.
							</p>
						</div>
						<div className="flex flex-wrap gap-3 text-sm text-foreground/80">
							<div className="dashboard-chip">
								{formatCountLabel(photos.length, "file")}
							</div>
							<div className="dashboard-chip">
								<Download className="h-4 w-4" />
								Direct downloads enabled
							</div>
						</div>
					</div>
					<UploadPhotoDialog folderId={folderId} />
				</div>
			</section>

			{photos.length > 0 ? (
				<PhotoGrid photos={photos} />
			) : (
				<DashboardEmptyState
					title="No files in this folder"
					description="Upload a file to generate previews for images and direct download links for everything else."
					action={
						<div className="flex flex-col items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--lagoon)]/10 text-[color:var(--lagoon-deep)]">
								<FolderOpen className="h-6 w-6" />
							</div>
							<UploadPhotoDialog folderId={folderId} />
						</div>
					}
				/>
			)}
		</div>
	);
}
