import { useAuth } from "@clerk/clerk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { DashboardLayout } from "#/components/page/dashboard/dashboardLayout";
import { DashboardPageLoading } from "#/components/page/dashboard/dashboardStates";
import FoldersView from "#/components/page/dashboard/folderView";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isLoaded, isSignedIn } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			void navigate({ to: "/" });
		}
	}, [isLoaded, isSignedIn, navigate]);

	if (!isLoaded) {
		return (
			<DashboardLayout>
				<DashboardPageLoading />
			</DashboardLayout>
		);
	}

	if (!isSignedIn) {
		return (
			<DashboardLayout>
				<DashboardPageLoading
					title="Redirecting"
					description="Sign-in is required to access your workspace."
				/>
			</DashboardLayout>
		);
	}

	return (
		<DashboardLayout>
			<FoldersView />
		</DashboardLayout>
	);
}
