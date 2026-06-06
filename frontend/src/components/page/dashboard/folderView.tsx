import { Link } from "@tanstack/react-router";
import { FolderOpen, RefreshCw } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useGetFoldersQuery } from "#/hook/folder.hook";
import { formatCountLabel } from "#/lib/format";
import { CreateFolderDialog } from "./createFolderDialog";
import {
	DashboardEmptyState,
	DashboardErrorState,
	DashboardSectionLoading,
} from "./dashboardStates";
import { FolderCard } from "./folderCard";

const FoldersView = () => {
	const {
		data: folders = [],
		isPending,
		isError,
		isFetching,
		refetch,
	} = useGetFoldersQuery();

	const fileCount = folders.reduce(
		(total, folder) => total + folder.photoCount,
		0,
	);

	return (
		<div className="space-y-6">
			<section className="dashboard-panel overflow-hidden p-6 sm:p-8">
				<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div className="space-y-4">
						<span className="dashboard-kicker">Workspace</span>
						<div className="space-y-2">
							<h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
								Keep every file organized and ready to share.
							</h1>
							<p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
								Create folders, upload assets securely, and download what you
								need without losing track of the latest version.
							</p>
						</div>
						<div className="flex flex-wrap gap-3 text-sm text-foreground/80">
							<div className="dashboard-chip">
								{formatCountLabel(folders.length, "folder")}
							</div>
							<div className="dashboard-chip">
								{formatCountLabel(fileCount, "file")}
							</div>
							<div className="dashboard-chip">
								{isFetching ? "Refreshing live data" : "Synced"}
							</div>
						</div>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button
							onClick={() => void refetch()}
							disabled={isFetching}
							variant="outline"
						>
							<RefreshCw className={isFetching ? "animate-spin" : ""} />
							Refresh
						</Button>
						<CreateFolderDialog />
					</div>
				</div>
			</section>

			{isPending ? <DashboardSectionLoading /> : null}

			{!isPending && isError ? (
				<DashboardErrorState
					title="Could not load your folders"
					description="The workspace list failed to load. Try requesting it again."
					onRetry={() => void refetch()}
				/>
			) : null}

			{!isPending && !isError && folders.length > 0 ? (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{folders.map((folder) => (
						<Link
							to="/dashboard/folder/$folderId"
							params={{ folderId: folder.id }}
							key={folder.id}
							className="group block"
						>
							<FolderCard
								id={folder.id}
								name={folder.name}
								photoCount={folder.photoCount}
								createdAt={folder.createdAt}
							/>
						</Link>
					))}
				</div>
			) : null}

			{!isPending && !isError && folders.length === 0 ? (
				<DashboardEmptyState
					title="No folders yet"
					description="Create your first folder to start collecting files in one place."
					action={
						<div className="flex flex-col items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--lagoon)]/10 text-[color:var(--lagoon-deep)]">
								<FolderOpen className="h-6 w-6" />
							</div>
							<CreateFolderDialog />
						</div>
					}
				/>
			) : null}
		</div>
	);
};

export default FoldersView;
