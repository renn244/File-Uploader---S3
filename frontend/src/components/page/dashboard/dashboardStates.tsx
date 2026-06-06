import { AlertCircle, LoaderCircle } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "#/components/ui/empty";
import { cn } from "#/lib/utils";

export function DashboardPageLoading({
	title = "Loading workspace",
	description = "Preparing your folders and files.",
}: {
	title?: string;
	description?: string;
}) {
	return (
		<div className="flex min-h-[55vh] items-center justify-center">
			<div className="dashboard-panel flex max-w-md flex-col items-center gap-4 px-8 py-10 text-center">
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--lagoon)]/15 text-[color:var(--lagoon-deep)]">
					<LoaderCircle className="h-7 w-7 animate-spin" />
				</div>
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold text-foreground">{title}</h1>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
			</div>
		</div>
	);
}

export function DashboardSectionLoading({
	cards = 3,
	className,
}: {
	cards?: number;
	className?: string;
}) {
	return (
		<div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>
			{Array.from(
				{ length: cards },
				(_, index) => `dashboard-loading-${index + 1}`,
			).map((key) => (
				<div key={key} className="dashboard-panel animate-pulse space-y-5 p-6">
					<div className="h-11 w-11 rounded-2xl bg-white/60" />
					<div className="space-y-3">
						<div className="h-5 w-2/3 rounded-full bg-white/70" />
						<div className="h-4 w-1/2 rounded-full bg-white/50" />
					</div>
					<div className="h-4 w-1/3 rounded-full bg-white/40" />
				</div>
			))}
		</div>
	);
}

export function DashboardEmptyState({
	title,
	description,
	action,
}: {
	title: string;
	description: string;
	action?: React.ReactNode;
}) {
	return (
		<Empty className="dashboard-panel border-white/40 bg-white/55 py-14">
			<EmptyHeader>
				<EmptyMedia
					variant="icon"
					className="bg-[color:var(--lagoon)]/10 text-[color:var(--lagoon-deep)]"
				/>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
			{action ? <EmptyContent>{action}</EmptyContent> : null}
		</Empty>
	);
}

export function DashboardErrorState({
	title,
	description,
	onRetry,
}: {
	title: string;
	description: string;
	onRetry?: () => void;
}) {
	return (
		<div className="dashboard-panel flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex items-start gap-4">
				<div className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
					<AlertCircle className="h-5 w-5" />
				</div>
				<div className="space-y-1">
					<h2 className="text-lg font-semibold text-foreground">{title}</h2>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
			</div>
			{onRetry ? (
				<Button onClick={onRetry} variant="outline">
					Try again
				</Button>
			) : null}
		</div>
	);
}
