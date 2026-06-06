import { Folder, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { useDeleteFolderByIdMutation } from "#/hook/folder.hook";
import { formatCountLabel, formatDateLabel } from "#/lib/format";
import { Card } from "@/components/ui/card";
import { DeleteFolderDialog } from "./deleteFolderDialog";

interface FolderCardProps {
	id: string;
	name: string;
	photoCount: number;
	createdAt: string;
	isClickable?: boolean;
}

export function FolderCard({
	id,
	name,
	photoCount,
	createdAt,
	isClickable = true,
}: FolderCardProps) {
	const [deleteOpen, setDeleteOpen] = useState(false);

	const { mutateAsync: deleteFolder, isPending: isDeleting } =
		useDeleteFolderByIdMutation(id);

	return (
		<Card
			className={`dashboard-panel relative gap-0 overflow-hidden border-white/45 p-6 transition duration-200 ${isClickable ? "cursor-pointer group-hover:-translate-y-1 group-hover:shadow-2xl" : ""}`}
		>
			<div className="mb-5 flex items-start justify-between gap-3">
				<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--lagoon)]/12 text-[color:var(--lagoon-deep)] shadow-sm shadow-[color:var(--lagoon)]/15">
					<Folder className="h-6 w-6" />
				</div>
				<Button
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						setDeleteOpen(true);
					}}
					variant="ghost"
					size="icon"
					className="rounded-full bg-white/45 hover:bg-white/70"
				>
					<Trash2 className="h-4 w-4 text-primary/70" />
				</Button>
				<DeleteFolderDialog
					isLoading={isDeleting}
					isOpen={deleteOpen}
					onCancel={() => {
						setDeleteOpen(false);
					}}
					onConfirm={() => deleteFolder().then(() => setDeleteOpen(false))}
					folderName={name}
				/>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<h3 className="text-lg font-semibold text-foreground">{name}</h3>
					<p className="text-sm text-muted-foreground">
						{formatCountLabel(photoCount, "file")}
					</p>
				</div>
				<div className="flex items-center justify-between border-t border-white/45 pt-4 text-xs uppercase tracking-[0.18em] text-foreground/45">
					<span>Created</span>
					<span>{formatDateLabel(createdAt)}</span>
				</div>
			</div>
		</Card>
	);
}
